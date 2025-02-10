"use client";

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { generateWalletCredentials } from '@/lib/wallet';
import { toast } from 'sonner';

export function WalletConnectionHandler() {
  const { address, isConnected } = useAccount();
  const [hasCheckedWallet, setHasCheckedWallet] = useState(false);

  useEffect(() => {
    if (!isConnected || !address || hasCheckedWallet) return;

    const handleWalletConnection = async () => {
      try {
        const checkResponse = await fetch(`/api/wallet/${address}`);
        
        if (checkResponse.ok) {
          setHasCheckedWallet(true);
          return;
        }

        if (checkResponse.status !== 404) {
          const error = await checkResponse.json();
          throw new Error(error.error || 'Failed to check wallet');
        }

        const credentials = await generateWalletCredentials();

        const createResponse = await fetch('/api/wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAddress: address,
            ...credentials
          }),
        });

        if (!createResponse.ok) {
          const error = await createResponse.json();
          throw new Error(error.error || 'Failed to create wallet');
        }

        toast.success('Wallet created successfully');
        setHasCheckedWallet(true);

      } catch (error) {
        console.error('Wallet handling error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to handle wallet connection');
      }
    };

    handleWalletConnection();
  }, [isConnected, address, hasCheckedWallet]);

  return (
    <appkit-button />
  );
}