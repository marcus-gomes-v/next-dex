// src/app/api/1inch/transaction/route.ts
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const url = "https://api.1inch.dev/swap/v6.0/1/approve/transaction";
    const config = {
      headers: {
        "Authorization": `Bearer ${process.env.ONE_INCH_API_KEY}`
      },
      params: {
        "tokenAddress": data.token,
        "amount": data.amount
      },
      paramsSerializer: {
        indexes: null
      }
    };

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1500);
    const approve = await axios.get(url, config);
    return NextResponse.json({ data: approve.data });

  } catch (error) {
    console.error('Approval transaction error:', error);
    return NextResponse.json(
      { error: "Failed to create approval transaction" },
      { status: 500 }
    );
  }
}