import { trpcServer } from "@hono/trpc-server";
import type { Hono } from "hono";

import { createContext } from "./context";
import { onError } from "./error";
import { trpcRouter } from "./router";

export const setupTrpc = (app: Hono) => {
  app.use(
    "/trpc/*",
    trpcServer({
      router: trpcRouter,
      createContext,
      onError,
    }),
  );
};

export type { TrpcRouter } from "./router";
