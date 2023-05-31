// import { createTRPCNext } from '@trpc/next';
import { createTRPCProxyClient } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import { AppRouter } from '../server/routers/_app';

const url = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/trpc`
  : 'http://localhost:3000/api/trpc';

// export const trpcClient = createTRPCNext<AppRouter>({
//   config() {
//     return {
//       links: [
//         httpBatchLink({
//           url,
//         }),
//       ],
//     };
//   },
//   ssr: false,
// });

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url,
    }),
  ],
});
