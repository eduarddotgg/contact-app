import pino, { type Level } from "pino";

import { config } from "./config";

const pinoInstance = pino({
  level: config.logLevel,
  ...(config.nodeEnv === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        ignore: "time,pid,hostname",
      },
    },
  }),
});

type LogMethod = (message: string, obj?: object) => void;

const createLogMethod = (level: Level): LogMethod => {
  return (message: string, obj?: object) => {
    const logObject = obj;

    if (logObject) {
      pinoInstance[level](logObject, message);
    } else {
      pinoInstance[level](message);
    }
  };
};

export const logger = {
  info: createLogMethod("info"),
  error: createLogMethod("error"),
  warn: createLogMethod("warn"),
  debug: createLogMethod("debug"),
  trace: createLogMethod("trace"),
};
