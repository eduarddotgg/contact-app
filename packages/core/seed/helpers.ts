import { type Table, getTableName } from "drizzle-orm";

import type { Transaction } from "../src/drizzle";

export const insertWithLogging = async <T extends Record<string, unknown>>(
  tx: Transaction,
  table: Table,
  data: T[],
) => {
  const tableName = getTableName(table);

  if (data.length === 0) {
    console.log(`No ${tableName} records to insert.`);
    return [];
  }

  const result = await tx.insert(table).values(data).onConflictDoNothing().returning();
  console.log(`Inserted ${result.length} ${tableName}`);
  return result;
};
