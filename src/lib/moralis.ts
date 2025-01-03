// src/lib/moralis.ts
import Moralis from "moralis";

async function initMoralis() {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({
      apiKey: process.env.MORALIS_KEY,
    });
  }
}

export default initMoralis;
