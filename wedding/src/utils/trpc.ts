import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../server/routers/_app';

const url = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://www.johnmolly.com/api/trpc`
  : 'http://localhost:3000/api/trpc';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url,
    }),
  ],
});
