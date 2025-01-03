"use client"
import { configureChains, createClient, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

export function getWagmiConfig() {
  const { provider, webSocketProvider } = configureChains(
    [mainnet],
    [publicProvider()]
  );

  return createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
  });
}