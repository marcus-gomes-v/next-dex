"use client";

import Tokens from "@/components/Tokens";
import { useWallet } from "@/components/providers/WalletProvider";

export default function Home() {
  const { address, isConnected } = useWallet();
  
  return <Tokens isConnected={isConnected} address={address} />;
}