"use client";

import { WagmiConfig } from "wagmi";
import { getWagmiConfig } from "@/lib/wagmi";
import { WalletProvider } from "./WalletProvider";
import { NetworkProvider } from "./NetworkProvider";
import { useState, useEffect } from "react";
import Header from "@/components/Header";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const wagmiConfig = getWagmiConfig();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WagmiConfig client={wagmiConfig}>
      <NetworkProvider>
        <WalletProvider>
          <div className="text-center">
            <Header />
            <div className="mt-[40px] flex justify-center">
              {children}
            </div>
          </div>
        </WalletProvider>
      </NetworkProvider>
    </WagmiConfig>
  );
}