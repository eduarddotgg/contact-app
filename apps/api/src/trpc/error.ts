import { AppError } from "@contact-app/core/errors";
import { logger } from "@contact-app/core/logger";
import type { TRPCError } from "@trpc/server";

export const onError = ({ error, path }: { error: TRPCError; path?: string }) => {
  const errorInfo = {
    path,
    message: error.message,
    code: error.code,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    cause: error.cause
      ? {
          message: error.cause.message,
          name: error.cause.name,
        }
      : undefined,
  };

  logger.error("TRPC error occurred", errorInfo);
};

export const errorFormatter = ({ shape, error }: { shape: unknown; error: TRPCError }) => {
  const formatted = shape as Record<string, unknown>;
  const cause = error.cause;

  return {
    ...formatted,
    data: {
      ...(formatted.data as Record<string, unknown>),
      code: cause instanceof AppError ? cause.code : undefined,
      context:
        process.env.NODE_ENV !== "production" && cause instanceof AppError
          ? cause.context
          : undefined,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    },
  };
};
