import * as path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({ path: path.join(process.cwd(), "../../.env") });

export default defineConfig({
    strict: true,
    verbose: true,
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DB_URL!,
    },
    schema: "./src/**/*.schema.ts",
});
