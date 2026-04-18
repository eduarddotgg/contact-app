import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
};

const PG_UNIQUE_VIOLATION = "23505";

export const isUniqueConstraintError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;
  if ("code" in error && error.code === PG_UNIQUE_VIOLATION) return true;
  if ("cause" in error) return isUniqueConstraintError(error.cause);
  return false;
};
