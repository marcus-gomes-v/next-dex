import type { RouterV2 } from '@0x/swap-ts-sdk';
import { httpLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';

export const zerox = createTRPCNext<RouterV2>({
  config() {
    return {
      links: [
        httpLink({
          headers: {
            '0x-api-key': process.env.NEXT_PUBLIC_ZEROX_API_KEY || '',
            '0x-version': 'v2',
          },
          url: 'https://api.0x.org/trpc/swap',
        }),
      ],
    };
  },
  ssr: false, // We don't need SSR for swapping
});