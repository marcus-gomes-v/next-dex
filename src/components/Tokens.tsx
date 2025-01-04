import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Token {
  address: string;
  name: string;
  symbol: string;
  price_usd: string;
  market_cap_usd: string;
  total_reserve_in_usd: string;
  volume_usd: string;
  logo: string;
}

export default function Tokens({ address, isConnected }: { address: string; isConnected: boolean; }) {
  console.log(isConnected);
  console.log(address);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const response = await axios.get('/api/coingecko/token/market');
        setTokens(response.data.tokens);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="rounded-lg">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-white">Available Tokens</h1>
          <p className="mt-2 text-sm text-gray-400">
            List of available tokens for trading with their market metrics
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root px-4 sm:px-6 lg:px-8 bg-[#0E111B]">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300">Token</th>
                  <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300">Price</th>
                  <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300">Market Cap</th>
                  <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300">24h Volume</th>
                  <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300">Liquidity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tokens.map((token) => (
                  <tr key={token.address} className="hover:bg-gray-800/50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            src={token.logo}
                            alt={token.symbol}
                            className="h-10 w-10 rounded-full"
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-white">{token.symbol}</div>
                          <div className="text-gray-400">{token.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-300">
                      ${parseFloat(token.price_usd).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-300">
                      ${parseFloat(token.market_cap_usd).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-300">
                      ${parseFloat(token.volume_usd).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-300">
                      ${parseFloat(token.total_reserve_in_usd).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}