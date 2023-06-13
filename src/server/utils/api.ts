import { httpBatchLink, loggerLink, splitLink, httpLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../routers";
import superjson from "superjson";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}
export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnReconnect: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      },
      links: [
        httpBatchLink({
          /**
           * If you want to use SSR, you need to use the server's full URL
           * @link https://trpc.io/docs/ssr
           **/
          url: `${getBaseUrl()}/api/trpc`,
          // You can pass any HTTP headers you wish here
          async headers() {
            return {
              // authorization: getAuthCookie(),
            };
          },
        }),
        loggerLink({
          enabled(opts) {
            return process.env.NODE_ENV !== "production" || (opts.direction === "down" && opts.result instanceof Error);
          },
        }),
        splitLink({
          condition(op) {
            return op.context.skipBatch === true;
          },
          true: httpLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
          false: httpBatchLink({
            url: `${getBaseUrl()}/api/trpc`,
          }),
        }),
      ],
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
