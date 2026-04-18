import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { Context } from "hono";

export const createContext = async (_opts: FetchCreateContextFnOptions, honoContext: Context) => ({
  honoContext,
});

export type TrpcContext = Awaited<ReturnType<typeof createContext>>;
