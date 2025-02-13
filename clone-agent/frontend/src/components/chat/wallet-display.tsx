"use client";

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scrollarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Types
interface Network {
  rpcUrl: string;
  scanApiUrl: string;
  scanApiKey: string | undefined;
  nativeSymbol: string;
  chainId: number;
}

type NetworkKey = 'sepolia' | 'base-sepolia';

interface TokenInfo {
  symbol: string;
  name: string;
  balance: string;
  address: string;
  metadata?: {
    logoURI?: string;
    priceUsd?: string;
    website?: string;
    social?: {
      twitter?: string;
      telegram?: string;
    };
  };
}

// Constants
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

const NETWORKS: { [key: string]: Network } = {
  'sepolia': {
    rpcUrl: process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC || 'https://red-sleek-tent.ethereum-sepolia.quiknode.pro/33f4d433f823f1734bf69b17da58467a7df068c6',
    scanApiUrl: 'https://api-sepolia.etherscan.io/api',
    scanApiKey: process.env.NEXT_PUBLIC_ETHSCAN,
    nativeSymbol: 'SepoliaETH',
    chainId: 11155111
  },
  'base-sepolia': {
    rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://red-sleek-tent.base-sepolia.quiknode.pro/33f4d433f823f1734bf69b17da58467a7df068c6',
    scanApiUrl: 'https://api-sepolia.basescan.org/api',
    scanApiKey: process.env.NEXT_PUBLIC_BASESCAN,
    nativeSymbol: 'ETH',
    chainId: 84532
  }
};

export default function WalletDisplay({ address }: { address: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkKey>('sepolia');

  const fetchTokenMetadata = async (tokenAddress: string, network: NetworkKey): Promise<TokenInfo['metadata'] | null> => {
    try {
      // Try DEXScreener first
      try {
        const dexscreenerResponse = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
        if (dexscreenerResponse.data.pairs?.[0]) {
          const tokenData = dexscreenerResponse.data.pairs[0];
          return {
            logoURI: tokenData.baseToken.logoURI || tokenData.quoteToken.logoURI,
            priceUsd: tokenData.priceUsd
          };
        }
      } catch (error) {
        console.error('DEXScreener fetch failed:', error);
      }

      // Try Etherscan/Basescan as fallback
      const networkConfig = NETWORKS[network];
      if (!networkConfig.scanApiKey) return null;

      const scanResponse = await axios.get(networkConfig.scanApiUrl, {
        params: {
          module: 'token',
          action: 'tokeninfo',
          contractaddress: tokenAddress,
          apikey: networkConfig.scanApiKey
        }
      });

      if (scanResponse.data.status === '1' && scanResponse.data.result?.[0]) {
        const tokenInfo = scanResponse.data.result[0];
        return {
          logoURI: tokenInfo.image || null,
          website: tokenInfo.website,
          social: {
            twitter: tokenInfo.twitter,
            telegram: tokenInfo.telegram
          }
        };
      }

      return null;
    } catch (error) {
      console.error('Token metadata fetch failed:', error);
      return null;
    }
  };

  const getAllTokenBalances = async (walletAddress: string, network: NetworkKey) => {
    const networkConfig = NETWORKS[network];
    if (!networkConfig.scanApiKey) return [];
    
    try {
      const response = await axios.get(networkConfig.scanApiUrl, {
        params: {
          module: 'account',
          action: 'tokentx',
          address: walletAddress,
          startblock: 0,
          endblock: 99999999,
          sort: 'desc',
          apikey: networkConfig.scanApiKey
        }
      });

      if (response.data.status === '1' && response.data.result) {
        const uniqueAddresses: string[] = response.data.result.reduce((acc: string[], tx: any) => {
          if (tx.contractAddress && !acc.includes(tx.contractAddress)) {
            acc.push(tx.contractAddress);
          }
          return acc;
        }, []);
        return uniqueAddresses;
      }
      return [];
    } catch (error) {
      console.error('Error fetching token transfers:', error);
      return [];
    }
  };

  const fetchWalletInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const networkConfig = NETWORKS[selectedNetwork];
      if (!networkConfig?.rpcUrl) {
        throw new Error(`RPC URL not configured for network: ${selectedNetwork}`);
      }

      const provider = new ethers.providers.JsonRpcProvider(networkConfig.rpcUrl);
      const formattedAddress = ethers.utils.getAddress(address);

      const balance = await provider.getBalance(formattedAddress);
      const balanceInEther = ethers.utils.formatEther(balance);

      const tokensList: TokenInfo[] = [{
        symbol: networkConfig.nativeSymbol,
        name: 'Native Token',
        balance: balanceInEther,
        address: 'Native',
        metadata: {
          logoURI: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/13c43/eth-diamond-black.png'
        }
      }];

      // Get ERC20 token balances
      const tokenAddresses = await getAllTokenBalances(formattedAddress, selectedNetwork);
      
      for (const tokenAddress of tokenAddresses) {
        try {
          const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
          
          const [balance, decimals, symbol, name] = await Promise.all([
            tokenContract.balanceOf(formattedAddress),
            tokenContract.decimals(),
            tokenContract.symbol(),
            tokenContract.name()
          ]);

          const formattedBalance = ethers.utils.formatUnits(balance, decimals);
          
          if (parseFloat(formattedBalance) > 0) {
            // const metadata = await fetchTokenMetadata(tokenAddress, selectedNetwork);
            tokensList.push({
              symbol,
              name,
              balance: formattedBalance,
              address: tokenAddress,
            });
          }
        } catch (error) {
          console.error(`Error fetching token at ${tokenAddress}:`, error);
        }
      }

      setTokens(tokensList);
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      setError('Failed to fetch wallet information');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchWalletInfo();
    }
  }, [address, selectedNetwork]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-500/10 text-red-500 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
        <Button 
          onClick={() => fetchWalletInfo()}
          variant="outline"
          className="w-full mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Network Selector */}
      <div className="px-1">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Network
        </label>
        <Select
          value={selectedNetwork}
          onValueChange={(value) => setSelectedNetwork(value as NetworkKey)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sepolia">Sepolia</SelectItem>
            <SelectItem value="base-sepolia">Base Sepolia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Scrollable Token List */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {tokens.map((token, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="font-medium">{token.symbol}</p>
                  <p className="text-sm text-muted-foreground">{token.name}</p>
                </div>
                {token.metadata?.logoURI && (
                  <img 
                    src={token.metadata.logoURI}
                    alt={`${token.symbol} logo`}
                    className="h-8 w-8 rounded-full"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                    }}
                  />
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-muted-foreground">Balance:</span>{' '}
                  <span className="font-medium">{parseFloat(token.balance).toFixed(6)}</span>
                </p>
                
                {token.metadata?.priceUsd && (
                  <p className="text-sm text-muted-foreground">
                    Value: ${(parseFloat(token.balance) * parseFloat(token.metadata.priceUsd)).toFixed(2)}
                  </p>
                )}
                
                {token.address !== 'Native' && (
                  <p className="text-xs text-muted-foreground mt-2 font-mono break-all">
                    {token.address}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}