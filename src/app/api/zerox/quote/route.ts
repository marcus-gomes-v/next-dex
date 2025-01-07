import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const params = new URLSearchParams({
      chainId: data.chainId,
      sellToken: data.sellToken,
      buyToken: data.buyToken,
      sellAmount: data.sellAmount,
      taker: data.taker,
      slippageBps: data.slippageBps,
    });

    const response = await fetch(
      `https://api.0x.org/swap/allowance-holder/quote?${params}`,
      {
        method: 'GET',
        headers: {
          '0x-api-key': process.env.ZEROX_API_KEY || '',
          '0x-version': 'v2',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }

    const quoteData = await response.json();
    return NextResponse.json(quoteData);

  } catch (error) {
    console.error('Quote error:', error);
    return NextResponse.json(
      { error: "Failed to get quote" },
      { status: 500 }
    );
  }
}