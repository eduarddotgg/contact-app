import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { TrpcRouter } from "../../../api/src/trpc/router";

export type RouterOutput = inferRouterOutputs<TrpcRouter>;
export type RouterInput = inferRouterInputs<TrpcRouter>;

export type Contact = RouterOutput["contact"]["list"]["items"][number];
