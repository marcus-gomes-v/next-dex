import { NextResponse } from "next/server";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import initMoralis from "@/lib/moralis";
import Moralis from "moralis";

const chainIdToEvmChain: { [key: number]: EvmChain } = {
  1: EvmChain.ETHEREUM,
  56: EvmChain.BSC,
  137: EvmChain.POLYGON,
  43114: EvmChain.AVALANCHE,
  10: EvmChain.OPTIMISM,
  42161: EvmChain.ARBITRUM,
  100: EvmChain.GNOSIS,
  250: EvmChain.FANTOM,
  8453: EvmChain.BASE,
};

function getEvmChain(chainId: number) {
  return chainIdToEvmChain[chainId] || null;
}

export async function POST(req: Request) {
  let data;
  try {
    data = await req.json();
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid JSON data" }, { status: 400 });
  }

  const { addressOne, addressTwo, chainId } = data;

  const evmChain = getEvmChain(chainId);
  if (!evmChain) {
    return NextResponse.json({ error: "Unsupported chain ID" }, { status: 400 });
  }

  try {
    await initMoralis();

    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
      address: addressOne,
      chain: evmChain,
    });

    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
      address: addressTwo,
      chain: evmChain,
    });

    const usdPrices = {
      tokenOne: responseOne.raw.usdPrice,
      tokenTwo: responseTwo.raw.usdPrice,
      ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice,
    };

    return NextResponse.json({ usdPrices });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch token prices", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
