import { logger } from "@contact-app/core/logger";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";

import { uploadsRoutes } from "./routes/uploads";
import { setupTrpc } from "./trpc";

export const honoApp = new Hono();

honoApp.use(honoLogger((message) => logger.info(message)));
honoApp.use(cors());

honoApp.get("/", (c) => c.json({ ok: true, name: "@contact-app/api" }));

honoApp.route("/", uploadsRoutes);
setupTrpc(honoApp);
