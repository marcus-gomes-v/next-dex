// src/lib/coingecko-mapping.ts
export const TOKEN_ID_MAP: { [key: string]: string } = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'usd-coin', // USDC
  '0x514910771af9ca656af840dff83e8264ecf986ca': 'chainlink', // LINK
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'tether', // USDT
  '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd': 'gemini-dollar', // GUSD
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'dai', // DAI
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'wrapped-ethereum', // WETH
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'wrapped-bitcoin', // WBTC
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': 'matic-network', // MATIC
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': 'uniswap', // UNI
  '0xd533a949740bb3306d119cc777fa900ba034cd52': 'curve-dao-token', // CRV
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': 'maker', // MKR
  '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce': 'shiba-inu', // SHIB
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': 'aave', // AAVE
};

// Alternative function to get price using contract address
export async function getTokenPriceByContract(address: string) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${address}&vs_currencies=usd`
  );
  const data = await response.json();
  return data[address.toLowerCase()]?.usd;
}