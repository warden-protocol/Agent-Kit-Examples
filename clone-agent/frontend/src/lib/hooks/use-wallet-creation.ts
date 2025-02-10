import { useState } from 'react';
import { generateWalletCredentials } from '../wallet';
import { toast } from 'sonner';

export function useWalletCreation() {
  const [isCreating, setIsCreating] = useState(false);

  const createWallet = async (userAddress: string) => {
    try {
      setIsCreating(true);
      
      const credentials = await generateWalletCredentials();

      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress,
          ...credentials
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create wallet');
      }

      toast.success('Wallet created successfully');
      return true;
    } catch (error) {
      console.error('Wallet creation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create wallet');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createWallet,
    isCreating
  };
}