import { config } from "@contact-app/core/config";
import { logger } from "@contact-app/core/logger";
import { S3 } from "@contact-app/core/s3/s3";
import { serve } from "@hono/node-server";

import { honoApp } from "./app";

await S3.ensureBucket();

serve({ fetch: honoApp.fetch, port: config.port }, () => {
  logger.info(`API server running on port ${config.port}`);
});
