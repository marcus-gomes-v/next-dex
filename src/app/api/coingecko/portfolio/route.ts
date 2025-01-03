// src/app/api/tokens/portfolio/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

async function getTokenBalances(address: string) {
  const response = await axios.post(ALCHEMY_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "alchemy_getTokenBalances",
    params: [address]
  });

  const balances = response.data.result.tokenBalances;
  return balances.filter((token: { tokenBalance: string; }) => parseInt(token.tokenBalance, 16) > 0);
}

async function getTokenMetadata(address: string) {
  const response = await axios.post(ALCHEMY_URL, {
    jsonrpc: "2.0",
    id: 1,
    method: "alchemy_getTokenMetadata",
    params: [address]
  });
  return response.data.result;
}

export async function POST(req: Request) {
  try {
    const { address } = await req.json();
    const tokenBalances = await getTokenBalances(address);

    const tokens = await Promise.all(
      tokenBalances.map(async (token: { contractAddress: string; tokenBalance: string; }) => {
        const metadata = await getTokenMetadata(token.contractAddress);
        const balance = parseInt(token.tokenBalance, 16) / Math.pow(10, metadata.decimals);

        // const priceResponse = await axios.get(
        //   `https://api.geckoterminal.com/api/v2/networks/eth/tokens/${token.contractAddress}`,
        //   { headers: { 'Accept': 'application/json;version=20230302' } }
        // );

        // const price = parseFloat(priceResponse?.data?.data?.attributes?.price_usd || '0');
        const price = 0;

        return {
          token_address: token.contractAddress,
          name: metadata.name,
          symbol: metadata.symbol,
          decimals: metadata.decimals,
          logo: metadata.logo,
          balance: balance.toString(),
          price
        };
      })
    );

    console.log(tokens);
    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 });
  }
}