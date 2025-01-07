import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NETWORKS } from '@/config/networkConfig';

interface NetworkContextType {
  selectedNetwork: typeof NETWORKS.SEPOLIA;
  setSelectedNetwork: (network: typeof NETWORKS.SEPOLIA) => void;
  currentTokenList: typeof NETWORKS.SEPOLIA.tokens;
  setCurrentTokenList: (tokens: typeof NETWORKS.SEPOLIA.tokens) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS.SEPOLIA);
  const [currentTokenList, setCurrentTokenList] = useState(NETWORKS.SEPOLIA.tokens);

  // Listen for network changes in MetaMask
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Check initial network
      window.ethereum.request({ method: 'eth_chainId' }).then((chainId: string) => {
        const network = Object.values(NETWORKS).find(n => n.chainId === chainId);
        if (network) {
          setSelectedNetwork(network);
          setCurrentTokenList(network.tokens); // Update token list
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId: string) => {
        const network = Object.values(NETWORKS).find(n => n.chainId === chainId);
        if (network) {
          setSelectedNetwork(network);
          setCurrentTokenList(network.tokens); // Update token list
        }
      });
    }
  }, []);

  useEffect(() => {
    setCurrentTokenList(selectedNetwork.tokens); // Update token list when network changes
  }, [selectedNetwork]);

  return (
    <NetworkContext.Provider 
      value={{ 
        selectedNetwork, 
        setSelectedNetwork,
        currentTokenList,
        setCurrentTokenList
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) throw new Error('useNetwork must be used within NetworkProvider');
  return context;
}
