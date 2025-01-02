"use client"

import React from "react";
import App from "./app";
import { BrowserRouter } from "react-router-dom";
import { configureChains, mainnet, WagmiConfig, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";


export default function Home() {

  const { provider, webSocketProvider } = configureChains(
    [mainnet],
    [publicProvider()]
  );

  const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
  });


  return (
    <React.StrictMode>
      <WagmiConfig client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WagmiConfig>
    </React.StrictMode>
  );
}
