import { NextResponse } from "next/server";
import axios from "axios";
import tokenList from "@/tokenList.json";

export async function GET() {
  try {
    const addresses = tokenList.map(token => token.address).join(',');
    const response = await axios.get(
      `https://api.geckoterminal.com/api/v2/networks/eth/tokens/multi/${addresses}`,
      { headers: { 'Accept': 'application/json;version=20230302' } }
    );

    const tokens = response.data.data.map((token: { attributes: { address: string; name: unknown; symbol: unknown; price_usd: unknown; market_cap_usd: unknown; total_reserve_in_usd: unknown; volume_usd: { h24: unknown; }; }; }) => ({
      address: token.attributes.address,
      name: token.attributes.name,
      symbol: token.attributes.symbol,
      price_usd: token.attributes.price_usd || '0',
      market_cap_usd: token.attributes.market_cap_usd || '0',
      total_reserve_in_usd: token.attributes.total_reserve_in_usd || '0',
      volume_usd: token.attributes.volume_usd?.h24 || '0',
      logo: tokenList.find(t =>
        t.address.toLowerCase() === token.attributes.address.toLowerCase()
      )?.img || ''
    }));

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error('Token market data fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch token data" }, { status: 500 });
  }
}