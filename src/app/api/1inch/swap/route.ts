import axios from "axios";
import { NextResponse } from "next/server";

// src/app/api/1inch/swap/route.ts
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const url = "https://api.1inch.dev/swap/v6.0/1/swap";
    const config = {
      headers: {
        "Authorization": `Bearer ${process.env.ONE_INCH_API_KEY}`
      },
      params: {
        src: data.fromTokenAddress,
        dst: data.toTokenAddress,
        amount: data.amount,
        from: data.fromAddress,
        origin: data.fromAddress,
        slippage: data.slippage,
      },
      paramsSerializer: {
        indexes: null
      }
    };

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(5000);
    const swap = await axios.get(url, config);
    return NextResponse.json({ data: swap.data });

  } catch (error) {
    console.error('Swap error:', error);
    return NextResponse.json(
      { error: "Failed to create swap transaction" },
      { status: 500 }
    );
  }
}