import type { AppErrorCode } from "./constants";

export class AppError extends Error {
  code: AppErrorCode;
  context?: Record<string, unknown>;

  constructor(code: AppErrorCode, message: string, context?: Record<string, unknown>) {
    const contextSuffix = context
      ? ` (${Object.entries(context)
          .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)
          .join(", ")})`
      : "";
    super(`${message}${contextSuffix}`);
    this.name = "AppError";
    this.code = code;
    this.context = context;
  }
}
