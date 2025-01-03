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
  await delay(5000);
  const approve = await axios.get(url, config);

  return NextResponse.json({ data: approve.data });
  
}