import { NextResponse } from "next/server";
import Moralis from "moralis";
import initMoralis from "@/lib/moralis";

export async function POST(req: Request) {
  try {
    const { address, chain } = await req.json();
    await initMoralis();

    const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
      address,
      chain: chain,
    });

    const tokenData = await Promise.all(
      tokens.raw.map(async (token) => {
        try {
          const price = await Moralis.EvmApi.token.getTokenPrice({
            address: token.token_address,
            chain: chain,
          });
          return { ...token, price: price.raw.usdPrice };
        } catch {
          return { ...token, price: 0 };
        }
      })
    );

    return NextResponse.json({ tokens: tokenData });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}