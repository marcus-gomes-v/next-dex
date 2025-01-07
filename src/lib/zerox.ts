import { createClientV2 } from '@0x/swap-ts-sdk';

// Create the 0x client directly
const client = createClientV2({
  apiKey: process.env.NEXT_PUBLIC_ZEROX_API_KEY || '',
  url: 'https://api.0x.org',
});

export default client;