import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { PHONE_REGEX } from "../constants";
import { timestamps } from "../utils";

export const contactTable = pgTable("contact", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull().unique(),
  phone: varchar("phone").notNull().unique(),
  photo: varchar("photo"),
  ...timestamps,
});

export const selectContactSchema = createSelectSchema(contactTable);
export type SelectContactSchema = z.infer<typeof selectContactSchema>;

export const createContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.email(),
  phone: z
    .string()
    .regex(PHONE_REGEX, "Invalid phone number (use E.164 format, e.g. +14155552671)"),
  photo: z.string().optional(),
});
export type CreateContactSchema = z.infer<typeof createContactSchema>;

export const updateContactSchema = createContactSchema.partial().extend({
  id: z.uuid(),
});
export type UpdateContactSchema = z.infer<typeof updateContactSchema>;

export const contactIdSchema = z.object({ id: z.uuid() });
export type ContactIdSchema = z.infer<typeof contactIdSchema>;
