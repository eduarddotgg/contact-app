import { drizzle } from "drizzle-orm/node-postgres";

import { config } from "./config";
import * as contactSchema from "./contact/contact.schema";

const schema = { ...contactSchema };

export const db = drizzle(config.db.url, { schema });

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
