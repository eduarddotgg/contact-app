import { faker } from "@faker-js/faker";

import type { CreateContactSchema } from "../src/contact/contact.schema";

export const generateContact = (
  photoKey: string,
  index: number,
): CreateContactSchema => ({
  name: faker.person.fullName(),
  email: `seed-${crypto.randomUUID()}@example.com`,
  phone: `+3620${String(index).padStart(7, "0")}`,
  photo: photoKey,
});
