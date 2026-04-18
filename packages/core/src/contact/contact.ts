import { and, desc, eq, lt, or, sql } from "drizzle-orm";

import { APP_ERROR_CODE, SHARED_SEED_PREFIX } from "../constants";
import { db } from "../drizzle";
import { AppError } from "../errors";
import { logger } from "../logger";
import { S3 } from "../s3/s3";
import { isUniqueConstraintError } from "../utils";
import { CONTACT_ERROR } from "./contact.errors";
import {
  type CreateContactSchema,
  contactTable,
  type ListContactsInputSchema,
  type UpdateContactSchema,
} from "./contact.schema";

const isSharedSeedPhoto = (key: string) => key.startsWith(SHARED_SEED_PREFIX);

const safeRemoveObject = async (key: string) => {
  if (isSharedSeedPhoto(key)) {
    return;
  }

  try {
    await S3.remove(key);
  } catch (error) {
    logger.error("Failed to remove S3 object during cleanup: ", { error, key });
  }
};

export namespace Contact {
  export const getById = async (id: string) => {
    const row = await db.query.contactTable.findFirst({ where: eq(contactTable.id, id) });

    if (!row) {
      logger.error("Contact not found: ", { id });
      throw new AppError(APP_ERROR_CODE.NOT_FOUND, CONTACT_ERROR.NOT_FOUND, { id });
    }

    return row;
  };

  export const list = async ({ cursor, limit }: ListContactsInputSchema) => {
    const where = cursor
      ? or(
          lt(contactTable.createdAt, cursor.createdAt),
          and(
            eq(contactTable.createdAt, cursor.createdAt),
            lt(contactTable.id, sql`${cursor.id}::uuid`),
          ),
        )
      : undefined;

    const rows = await db.query.contactTable.findMany({
      where,
      orderBy: [desc(contactTable.createdAt), desc(contactTable.id)],
      limit: limit + 1,
    });

    const hasNextPage = rows.length > limit;
    const items = hasNextPage ? rows.slice(0, limit) : rows;
    const last = items[items.length - 1];
    const nextCursor = hasNextPage && last ? { createdAt: last.createdAt, id: last.id } : null;

    return { items, nextCursor };
  };

  export const create = async (input: CreateContactSchema) => {
    try {
      const [row] = await db.insert(contactTable).values(input).returning();
      return row;
    } catch (error) {
      logger.error("Error while creating contact: ", { error });

      if (isUniqueConstraintError(error)) {
        const context = { email: input.email, phone: input.phone };

        throw new AppError(APP_ERROR_CODE.CONFLICT, CONTACT_ERROR.ALREADY_EXISTS, context);
      }

      throw new AppError(APP_ERROR_CODE.INTERNAL_SERVER_ERROR, "", {});
    }
  };

  export const update = async ({ id, ...rest }: UpdateContactSchema) => {
    const previousPhoto =
      typeof rest.photo === "string"
        ? ((
            await db.query.contactTable.findFirst({
              where: eq(contactTable.id, id),
              columns: { photo: true },
            })
          )?.photo ?? null)
        : null;

    try {
      const [row] = await db
        .update(contactTable)
        .set(rest)
        .where(eq(contactTable.id, id))
        .returning();

      if (!row) {
        logger.error("Contact not found while updating contact: ", { id });
        throw new AppError(APP_ERROR_CODE.NOT_FOUND, CONTACT_ERROR.NOT_FOUND, { id });
      }

      if (previousPhoto && previousPhoto !== row.photo) {
        await safeRemoveObject(previousPhoto);
      }

      return row;
    } catch (error) {
      logger.error("Error while updating contact: ", { error });

      if (error instanceof AppError) {
        throw error;
      }

      if (isUniqueConstraintError(error)) {
        throw new AppError(APP_ERROR_CODE.CONFLICT, CONTACT_ERROR.ALREADY_EXISTS, { id });
      }

      throw new AppError(APP_ERROR_CODE.INTERNAL_SERVER_ERROR, "", {});
    }
  };

  export const deleteById = async (id: string) => {
    try {
      const [row] = await db
        .delete(contactTable)
        .where(eq(contactTable.id, id))
        .returning({ id: contactTable.id, photo: contactTable.photo });

      if (!row) {
        logger.error("Error while deleting contact: ", { id });
        throw new AppError(APP_ERROR_CODE.NOT_FOUND, CONTACT_ERROR.NOT_FOUND, { id });
      }

      if (row.photo) {
        await safeRemoveObject(row.photo);
      }
    } catch (error) {
      logger.error("Error while deleting contact: ", { error });

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(APP_ERROR_CODE.INTERNAL_SERVER_ERROR, "", {});
    }
  };
}
