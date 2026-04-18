import { faker } from "@faker-js/faker";

import type { CreateContactSchema } from "../src/contact/contact.schema";

export const generateContact = (photoKey: string): CreateContactSchema => ({
  name: faker.person.fullName(),
  email: `seed-${crypto.randomUUID()}@example.com`,
  phone: `+1${faker.string.numeric(10)}`,
  photo: photoKey,
});
