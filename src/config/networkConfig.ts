/* eslint-disable @typescript-eslint/no-explicit-any */
interface Token {
  ticker: string;
  img: string;
  name: string;
  address: string;
  decimals: number;
  mainnetAddress?: string; // For price reference
}

interface NetworkConfig {
  chainId: string;
  name: string;
  icon: string;
  rpcUrl: string;
  routerAddress: string;
  explorerUrl: string;
  tokens: Token[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// const mainNet = {
//   chainId: '0x1',
//   name: 'Ethereum',
//   icon: '/eth.svg',
//   rpcUrl: 'https://mainnet.infura.io/v3/your-infura-key',
//   routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
//   explorerUrl: 'https://etherscan.io',
//   nativeCurrency: {
//     name: "Ethereum",
//     symbol: "ETH",
//     decimals: 18
//   },
//   tokens: [
//     {
//       "ticker": "WBTC",
//       "img": "https://cdn.moralis.io/eth/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png",
//       "name": "Wrapped Bitcoin",
//       "address": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
//       "decimals": 8
//     },
//     {
//       "ticker": "USDT",
//       "img": "https://cdn.moralis.io/eth/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
//       "name": "Tether USD",
//       "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
//       "decimals": 6
//     },
//     {
//       "ticker": "USDC",
//       "img": "https://cdn.moralis.io/eth/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
//       "name": "USD Coin",
//       "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
//       "decimals": 6
//     },
//     {
//       "ticker": "LINK",
//       "img": "https://cdn.moralis.io/eth/0x514910771af9ca656af840dff83e8264ecf986ca.png",
//       "name": "Chainlink",
//       "address": "0x514910771af9ca656af840dff83e8264ecf986ca",
//       "decimals": 18
//     },
//     {
//       "ticker": "GUSD",
//       "img": "https://cdn.moralis.io/eth/0x056fd409e1d7a124bd7017459dfea2f387b6d5cd.png",
//       "name": "Gemini USD",
//       "address": "0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd",
//       "decimals": 2
//     },
//     {
//       "ticker": "DAI",
//       "img": "https://cdn.moralis.io/eth/0x6b175474e89094c44da98b954eedeac495271d0f.png",
//       "name": "Dai Stablecoin",
//       "address": "0x6b175474e89094c44da98b954eedeac495271d0f",
//       "decimals": 18
//     },
//     {
//       "ticker": "WETH",
//       "img": "https://cdn.moralis.io/eth/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
//       "name": "Wrapped Ethereum",
//       "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
//       "decimals": 18
//     },
//     {
//       "ticker": "MATIC",
//       "img": "https://cdn.moralis.io/eth/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
//       "name": "Matic Token",
//       "address": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
//       "decimals": 18
//     },
//     {
//       "ticker": "UNI",
//       "img": "https://cdn.moralis.io/eth/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png",
//       "name": "Uniswap",
//       "address": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
//       "decimals": 18
//     },
//     {
//       "ticker": "CRV",
//       "img": "https://cdn.moralis.io/eth/0xd533a949740bb3306d119cc777fa900ba034cd52.png",
//       "name": "Curve DAO Token",
//       "address": "0xd533a949740bb3306d119cc777fa900ba034cd52",
//       "decimals": 18
//     },
//     {
//       "ticker": "MKR",
//       "img": "https://cdn.moralis.io/eth/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2.png",
//       "name": "Maker",
//       "address": "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
//       "decimals": 18
//     },
//     {
//       "ticker": "SHIB",
//       "img": "https://cdn.moralis.io/eth/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce.png",
//       "name": "Shiba Inu",
//       "address": "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
//       "decimals": 18
//     },
//     {
//       "ticker": "AAVE",
//       "img": "https://cdn.moralis.io/eth/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png",
//       "name": "AAVE",
//       "address": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
//       "decimals": 18
//     }
//   ]
// };

const sepolia = {
  chainId: '0xaa36a7',
  name: 'Sepolia',
  icon: '/eth.svg',
  rpcUrl: 'https://sepolia.infura.io/v3/your-infura-key',
  routerAddress: '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008',
  explorerUrl: 'https://sepolia.etherscan.io',
  nativeCurrency: {
    name: "Sepolia Ethereum",
    symbol: "SEP",
    decimals: 18
  },
  tokens: [
    {
      ticker: "ETH",
      img: "/eth.svg", // Add a relevant ETH logo here
      name: "Ethereum",
      address: "0x0000000000000000000000000000000000000000", // ETH placeholder address
      mainnetAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // For price reference
      decimals: 18,
    },
    {
      ticker: "UNI",
      img: "https://cdn.moralis.io/eth/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png",
      name: "Uniswap",
      address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // Sepolia address
      mainnetAddress: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // For price reference
      decimals: 18
    }
  ]
}

const holesky = {
  chainId: '0x4268',
  name: 'Holesky',
  icon: '/eth.svg',
  rpcUrl: 'https://ethereum-holesky.publicnode.com',
  routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  explorerUrl: 'https://holesky.etherscan.io',
  nativeCurrency: {
    name: "Holesky Ethereum",
    symbol: "ETH",
    decimals: 18
  },
  tokens: [
    {
      ticker: "ETH",
      img: "/eth.svg", // Add a relevant ETH logo here
      name: "Ethereum",
      address: "0x0000000000000000000000000000000000000000", // ETH placeholder address
      mainnetAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // For price reference
      decimals: 18,
    },
    {
      ticker: "DAI",
      img: "https://cdn.moralis.io/eth/0x6b175474e89094c44da98b954eedeac495271d0f.png",
      name: "Dai Stablecoin",
      address: "0x2d2c18F63D2144161B38844dCd529124Fbb93cA2", // Holesky address
      mainnetAddress: "0x6b175474e89094c44da98b954eedeac495271d0f", // For price reference
      decimals: 18
    }
  ]
}

export const NETWORKS: { [key: string]: NetworkConfig } = {
  SEPOLIA: sepolia,
  HOLESKY: holesky
};