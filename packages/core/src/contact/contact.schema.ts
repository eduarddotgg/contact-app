import { desc } from "drizzle-orm";
import { index, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { PHONE_EXAMPLE, PHONE_REGEX } from "../constants";
import { timestamps } from "../utils";

export const contactTable = pgTable(
  "contact",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    phone: varchar("phone").notNull().unique(),
    photo: varchar("photo"),
    ...timestamps,
  },
  (t) => [index("contact_created_at_id_idx").on(desc(t.createdAt), desc(t.id))],
);

export const selectContactSchema = createSelectSchema(contactTable);
export type SelectContactSchema = z.infer<typeof selectContactSchema>;

export const createContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email(),
  phone: z
    .string()
    .regex(PHONE_REGEX, `Invalid phone number (use E.164 format, e.g. ${PHONE_EXAMPLE})`),
  photo: z.string().optional(),
});
export type CreateContactSchema = z.infer<typeof createContactSchema>;

export const updateContactSchema = createContactSchema.partial().extend({
  id: z.uuid(),
});
export type UpdateContactSchema = z.infer<typeof updateContactSchema>;

export const contactIdSchema = z.object({ id: z.uuid() });
export type ContactIdSchema = z.infer<typeof contactIdSchema>;

export const listContactsCursorSchema = z.object({
  createdAt: z.string().min(1),
  id: z.uuid(),
});
export type ListContactsCursorSchema = z.infer<typeof listContactsCursorSchema>;

export const listContactsInputSchema = z.object({
  cursor: listContactsCursorSchema.nullish(),
  limit: z.number().int().min(1).max(100).default(20),
});
export type ListContactsInputSchema = z.infer<typeof listContactsInputSchema>;
