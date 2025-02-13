import { ethers } from 'ethers';

export interface WalletCredentials {
  publicKey: string;
  privateKey: string;
  seedPhrase: string;
}

export async function generateWalletCredentials(): Promise<WalletCredentials> {
  const mnemonic = ethers.Wallet.createRandom().mnemonic;
  if (!mnemonic || !mnemonic.phrase) {
    throw new Error('Failed to generate mnemonic');
  }

  const wallet = ethers.Wallet.fromMnemonic(mnemonic.phrase);

  return {
    publicKey: wallet.address,
    privateKey: wallet.privateKey,
    seedPhrase: mnemonic.phrase
  };
}