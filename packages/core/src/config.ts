import dotenv from "dotenv";
import env from "env-var";

import { LOG_LEVELS } from "./constants";
import * as path from "node:path";

dotenv.config({ path: path.join(process.cwd(), "../../.env") });

export const config = {
  port: env.get("PORT").default(3000).asInt(),
  nodeEnv: env.get("NODE_ENV").default("development").asString(),
  logLevel: env.get("LOG_LEVEL").default(LOG_LEVELS.DEBUG).asEnum(Object.values(LOG_LEVELS)),
  db: {
    url: env.get("DB_URL").required().asString(),
  },
  s3: {
    endpoint: env.get("S3_ENDPOINT").default("http://localhost:9000").asString(),
    region: env.get("S3_REGION").default("us-east-1").asString(),
    accessKeyId: env.get("S3_ACCESS_KEY_ID").default("minioadmin").asString(),
    secretAccessKey: env.get("S3_SECRET_ACCESS_KEY").default("minioadmin").asString(),
    bucket: env.get("S3_BUCKET").default("contacts").asString(),
  },
};
