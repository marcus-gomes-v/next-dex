// src/app/api/tokens/price/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const BASE_URL = "https://api.geckoterminal.com/api/v2";

export async function POST(req: Request) {
  try {
    const { addressOne, addressTwo } = await req.json();
    const addresses = `${addressOne},${addressTwo}`.toLowerCase();

    const response = await axios.get(`${BASE_URL}/simple/networks/eth/token_price/${addresses}`, {
      headers: {
        'Accept': 'application/json;version=20230302'
      }
    });

    const tokenPrices = response.data.data.attributes.token_prices;
    const priceOne = parseFloat(tokenPrices[addressOne.toLowerCase()]) || 0;
    const priceTwo = parseFloat(tokenPrices[addressTwo.toLowerCase()]) || 0;

    return NextResponse.json({
      usdPrices: {
        tokenOne: priceOne,
        tokenTwo: priceTwo,
        ratio: priceTwo ? priceOne / priceTwo : 0
      }
    });

  } catch (error) {
    console.error('Price fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}