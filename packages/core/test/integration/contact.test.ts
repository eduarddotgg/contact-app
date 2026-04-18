import { faker } from "@faker-js/faker";
import { inArray } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { APP_ERROR_CODE } from "../../src/constants";
import { Contact } from "../../src/contact/contact";
import {
  type CreateContactSchema,
  contactTable,
} from "../../src/contact/contact.schema";
import { db } from "../../src/drizzle";
import { AppError } from "../../src/errors";
import { S3 } from "../../src/s3/s3";

vi.mock("../../src/logger", () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
  },
}));

vi.mock("../../src/s3/s3", () => ({
  S3: {
    ensureBucket: vi.fn(),
    put: vi.fn(),
    get: vi.fn(),
    remove: vi.fn(),
  },
}));

beforeEach(() => {
  vi.mocked(S3.remove).mockClear();
});

const makeInput = (overrides?: Partial<CreateContactSchema>): CreateContactSchema => ({
  name: faker.person.fullName(),
  email: `test-${crypto.randomUUID()}@example.com`,
  phone: `+1${faker.string.numeric(10)}`,
  photo: faker.image.avatar(),
  ...overrides,
});

const makeCleanup = () => {
  const ids: string[] = [];
  const cleanup = async () => {
    if (ids.length === 0) return;
    await db.delete(contactTable).where(inArray(contactTable.id, ids));
    ids.length = 0;
  };
  return { ids, cleanup };
};

describe("Contact.getById", () => {
  const { ids, cleanup } = makeCleanup();
  afterEach(cleanup);

  it("returns the inserted contact", async () => {
    const created = (await Contact.create(makeInput()))!;
    ids.push(created.id);

    const row = await Contact.getById(created.id);

    expect(row).toMatchObject({
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
    });
  });

  it("throws AppError(NOT_FOUND) for unknown UUID", async () => {
    const unknownId = crypto.randomUUID();

    await expect(Contact.getById(unknownId)).rejects.toBeInstanceOf(AppError);
    await expect(Contact.getById(unknownId)).rejects.toMatchObject({
      code: APP_ERROR_CODE.NOT_FOUND,
    });
  });
});

describe("Contact.list", () => {
  const { ids, cleanup } = makeCleanup();
  afterEach(cleanup);

  it("includes inserted fixtures ordered by createdAt DESC", async () => {
    const first = (await Contact.create(makeInput()))!;
    ids.push(first.id);
    await new Promise((resolve) => setTimeout(resolve, 10));
    const second = (await Contact.create(makeInput()))!;
    ids.push(second.id);

    const rows = await Contact.list();

    const firstIndex = rows.findIndex((r) => r.id === first.id);
    const secondIndex = rows.findIndex((r) => r.id === second.id);

    expect(firstIndex).toBeGreaterThanOrEqual(0);
    expect(secondIndex).toBeGreaterThanOrEqual(0);
    expect(secondIndex).toBeLessThan(firstIndex);
  });
});

describe("Contact.create", () => {
  const { ids, cleanup } = makeCleanup();
  afterEach(cleanup);

  it("inserts and returns the new contact", async () => {
    const input = makeInput();

    const created = (await Contact.create(input))!;
    ids.push(created.id);

    expect(created).toMatchObject({
      name: input.name,
      email: input.email,
      phone: input.phone,
      photo: input.photo,
    });
    expect(created.id).toEqual(expect.any(String));
  });

  it("throws AppError(CONFLICT) on duplicate email", async () => {
    const first = (await Contact.create(makeInput()))!;
    ids.push(first.id);

    const duplicate = makeInput({ email: first.email });

    await expect(Contact.create(duplicate)).rejects.toMatchObject({
      code: APP_ERROR_CODE.CONFLICT,
    });
  });

  it("throws AppError(CONFLICT) on duplicate phone", async () => {
    const first = (await Contact.create(makeInput()))!;
    ids.push(first.id);

    const duplicate = makeInput({ phone: first.phone });

    await expect(Contact.create(duplicate)).rejects.toMatchObject({
      code: APP_ERROR_CODE.CONFLICT,
    });
  });
});

describe("Contact.update", () => {
  const { ids, cleanup } = makeCleanup();
  afterEach(cleanup);

  it("updates fields and persists them", async () => {
    const created = (await Contact.create(makeInput()))!;
    ids.push(created.id);

    const newName = faker.person.fullName();
    const updated = (await Contact.update({ id: created.id, name: newName }))!;

    expect(updated.name).toBe(newName);

    const reloaded = await Contact.getById(created.id);
    expect(reloaded.name).toBe(newName);
  });

  it("throws AppError(NOT_FOUND) for unknown UUID", async () => {
    const unknownId = crypto.randomUUID();

    await expect(
      Contact.update({ id: unknownId, name: faker.person.fullName() }),
    ).rejects.toMatchObject({
      code: APP_ERROR_CODE.NOT_FOUND,
    });
  });

  it("throws AppError(CONFLICT) when changing email to an existing one", async () => {
    const first = (await Contact.create(makeInput()))!;
    const second = (await Contact.create(makeInput()))!;
    ids.push(first.id, second.id);

    await expect(
      Contact.update({ id: second.id, email: first.email }),
    ).rejects.toMatchObject({
      code: APP_ERROR_CODE.CONFLICT,
    });
  });

  it("removes the previous S3 object when photo changes", async () => {
    const oldPhoto = `old-${crypto.randomUUID()}.png`;
    const created = (await Contact.create(makeInput({ photo: oldPhoto })))!;
    ids.push(created.id);

    const newPhoto = `new-${crypto.randomUUID()}.png`;
    await Contact.update({ id: created.id, photo: newPhoto });

    expect(S3.remove).toHaveBeenCalledWith(oldPhoto);
  });

  it("does not remove the S3 object when photo is unchanged", async () => {
    const created = (await Contact.create(makeInput()))!;
    ids.push(created.id);

    await Contact.update({ id: created.id, name: faker.person.fullName() });

    expect(S3.remove).not.toHaveBeenCalled();
  });
});

describe("Contact.deleteById", () => {
  const { cleanup } = makeCleanup();
  afterEach(cleanup);

  it("deletes the contact; subsequent getById throws NOT_FOUND", async () => {
    const created = (await Contact.create(makeInput()))!;

    await Contact.deleteById(created.id);

    await expect(Contact.getById(created.id)).rejects.toMatchObject({
      code: APP_ERROR_CODE.NOT_FOUND,
    });
  });

  it("throws AppError(NOT_FOUND) for unknown UUID", async () => {
    const unknownId = crypto.randomUUID();

    await expect(Contact.deleteById(unknownId)).rejects.toMatchObject({
      code: APP_ERROR_CODE.NOT_FOUND,
    });
  });

  it("removes the contact's S3 object on delete", async () => {
    const photo = `delete-${crypto.randomUUID()}.png`;
    const created = (await Contact.create(makeInput({ photo })))!;

    await Contact.deleteById(created.id);

    expect(S3.remove).toHaveBeenCalledWith(photo);
  });
});
