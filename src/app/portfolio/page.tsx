"use client";

import Portfolio from "@/components/Portfolio";
import { useWallet } from "@/components/providers/WalletProvider";

export default function Home() {
  const { address, isConnected } = useWallet();
  
  return <Portfolio isConnected={isConnected} address={address} />;
}