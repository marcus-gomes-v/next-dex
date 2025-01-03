"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Token {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string;
  thumbnail?: string;
  balance: string;
  price: number;
}

export default function Portfolio({ address, isConnected }: { address: string; isConnected: boolean; }) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      if (!isConnected || !address) return;
      try {
        const response = await axios.post('/api/moralis/portfolio', {
          address,
          chain: '0x1'
        });
        setTokens(response.data.tokens);
      } catch (error) {
        console.error('Failed to fetch portfolio:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolio();
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <div className=" text-white">
        <div className="text-center">
          <h3 className="mt-2 text-sm font-semibold">No wallet connected</h3>
          <p className="mt-1 text-sm text-gray-400">Connect your wallet to see your portfolio.</p>
        </div>
      </div>
    );
  }

  console.log(loading);

  return (
    <div className=" rounded-lg">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-white">Portfolio</h1>
          <p className="mt-2 text-sm text-gray-400">
            Your current token holdings and their values.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root px-4 sm:px-6 lg:px-8 bg-[#0E111B]">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300 sm:pl-0">
                    Token
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
                    Balance
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {tokens.map((token) => (
                  <tr key={token.token_address} className="hover:bg-gray-800/50">
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                      <div className="flex items-center">
                        <div className="size-11 shrink-0">
                          <Image
                            src={token.logo || '/eth.svg'} 
                            alt={token.symbol} 
                            className="size-11 rounded-full"
                            width={44}
                            height={44}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-white">{token.symbol}</div>
                          <div className="mt-1 text-gray-400">{token.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-300">
                      {parseFloat(token.balance).toFixed(4)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-300">
                      ${token.price?.toFixed(2) || '0.00'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-300">
                      ${(parseFloat(token.balance) * (token.price || 0)).toFixed(2)}
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