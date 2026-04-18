import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import type { TrpcRouter } from "../../../api/src/trpc/router";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
});

export const trpcClient = createTRPCClient<TrpcRouter>({
  links: [
    httpLink({
      url: `${import.meta.env.VITE_API_URL}/trpc`,
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<TrpcRouter>({
  client: trpcClient,
  queryClient,
});
