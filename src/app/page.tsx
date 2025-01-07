"use client";

import MetaMaskSwap from "@/components/MetaMaskSwap";
import { useWallet } from "@/components/providers/WalletProvider";

export default function Home() {
  const { address, isConnected } = useWallet();
  
  return <MetaMaskSwap isConnected={isConnected} address={address} />;
}