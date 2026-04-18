import { AppError } from "@contact-app/core/errors";
import { initTRPC, TRPCError } from "@trpc/server";

import type { TrpcContext } from "./context";
import { errorFormatter } from "./error";

const t = initTRPC.context<TrpcContext>().create({ errorFormatter });

const appErrorMapper = t.middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof AppError) {
      throw new TRPCError({ code: error.code, message: error.message, cause: error });
    }

    throw error;
  }
});

export const router = t.router;
export const publicProcedure = t.procedure.use(appErrorMapper);
