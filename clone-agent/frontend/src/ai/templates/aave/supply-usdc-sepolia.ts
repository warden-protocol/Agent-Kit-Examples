import { ToolConfig } from '../index';
import { parseUnits, Hash } from 'viem';
import { publicClient } from '../../client';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { AAVE_USDC_SEPOLIA, ETH_SEPOLIA_POOL } from '../../constants';
import { getSessionAddress } from '@/ai/sessions';

const POOL_ABI = [{
  name: 'supply',
  type: 'function',
  stateMutability: 'nonpayable',
  inputs: [
    { name: 'asset', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'onBehalfOf', type: 'address' },
    { name: 'referralCode', type: 'uint16' }
  ],
  outputs: []
}] as const;

type AaveSupplyArgs = {
  amount: string;
};

export const aaveSupplyUSDCTool: ToolConfig = {
  definition: {
    type: 'function',
    function: {
      name: 'supply_usdc_aave',
      description: 'Supply USDC into Aave V3 lending pool',
      parameters: {
        type: 'object',
        properties: {
          amount: {
            type: 'string',
            description: 'Amount of USDC to supply (e.g. "1", "100")'
          }
        },
        required: ['amount']
      }
    }
  },
  handler: async (args: AaveSupplyArgs) => {
    try {
      const userAddress = await getSessionAddress();
      console.log('User address:', userAddress);

      const privateKeyEnv = process.env.PRIVATE_KEY;
      if (!privateKeyEnv) {
        throw new Error('Private key is not defined in environment variables');
      }

      const privateKey = privateKeyEnv.startsWith('0x') 
        ? (privateKeyEnv as `0x${string}`)
        : `0x${privateKeyEnv}` as `0x${string}`;

      const account = privateKeyToAccount(privateKey);
      
      const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(process.env.ETH_SEPOLIA_RPC as string)
      });

      const pool = {
        address: ETH_SEPOLIA_POOL,
        abi: POOL_ABI
      } as const;

      const hash = await walletClient.writeContract({
        ...pool,
        functionName: 'supply',
        args: [
          AAVE_USDC_SEPOLIA,
          parseUnits(args.amount, 6),
          account.address,
          0
        ],
        gas: BigInt(500000)
      });

      const receipt = await publicClient[1].waitForTransactionReceipt({ hash });
      return `Successfully supplied ${args.amount} USDC to Aave V3. Transaction hash: ${receipt.transactionHash}`;
    } catch (error) {
      console.error('Aave supply error:', error);
      return 'Failed to supply USDC to Aave V3. Please verify your wallet is connected and try again.';
    }
  }
};