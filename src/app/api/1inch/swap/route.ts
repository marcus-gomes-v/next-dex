import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let data;
  try {
    data = await req.json();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error to process json data, certify that is correct" }, { status: 500 });
  }

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
  await delay(2000);
  const swap = await axios.get(url, config);

  return NextResponse.json({ data: swap.data });

}