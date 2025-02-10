import { listTokens } from '@/utils/pump';
import { ToolConfig } from '../index';
import { ethers } from 'ethers';

const NETWORK_CONFIG = {
  chainId: 545,
  rpcUrl: 'https://testnet.evm.nodes.onflow.org',
  privateKey: '0x45e40ba25677e08f574d22af580f759d686aa84d5188be8d9420385a784f726a'
};

const CONTRACT_CONFIG = {
  address: '0xBBfA869CF253aB76742AB9bc7902f783546BC830',
  abi: [
    {
      inputs: [
        { internalType: 'string', name: '_name', type: 'string' },
        { internalType: 'string', name: '_symbol', type: 'string' },
        { internalType: 'uint256', name: '_totalSupply', type: 'uint256' }
      ],
      name: 'launchToken',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'memeTokenAddress', type: 'address' },
        { internalType: 'uint256', name: 'totalCost', type: 'uint256' }
      ],
      name: 'buyTokens',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [
        { internalType: 'address', name: 'memeTokenAddress', type: 'address' },
        { internalType: 'uint256', name: 'numTokens', type: 'uint256' }
      ],
      name: 'sellTokens',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'getAllMemeTokens',
      outputs: [
        {
          components: [
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'address', name: 'tokenAddress', type: 'address' },
            { internalType: 'uint256', name: 'supply', type: 'uint256' }
          ],
          internalType: 'struct PumpFlowTokenFactory.MemeToken[]',
          name: '',
          type: 'tuple[]'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    }
  ]
};

const setupContract = () => {
  const privateKey = process.env.FLOW_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Flow private key not defined in environment variables');
  }

  const provider = new ethers.providers.JsonRpcProvider(NETWORK_CONFIG.rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  return new ethers.Contract(CONTRACT_CONFIG.address, CONTRACT_CONFIG.abi, wallet);
};

type LaunchTokenArgs = {
  name: string;
  symbol: string;
  supply: string;
};

export const pumpFlowLaunchTool: ToolConfig = {
  definition: {
    type: 'function',
    function: {
      name: 'launch_pump_token',
      description: 'Launch a new meme token on Flow network',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of the token'
          },
          symbol: {
            type: 'string',
            description: 'Symbol/ticker of the token'
          },
          supply: {
            type: 'string',
            description: 'Initial supply of tokens (e.g. "1000000")'
          }
        },
        required: ['name', 'symbol', 'supply']
      }
    }
  },
  handler: async (args: LaunchTokenArgs) => {
    try {
      const contract = setupContract();
      const provider = contract.provider;

      const gasPrice = await provider.getGasPrice();
      const adjustedGasPrice = gasPrice.mul(120).div(100);

      const tx = await contract.launchToken(
        args.name,
        args.symbol,
        ethers.utils.parseUnits(args.supply, 18),
        {
          gasLimit: 5000000,
          gasPrice: adjustedGasPrice
        }
      );

      const receipt = await tx.wait();
      return `Successfully launched ${args.name} token. Transaction hash: ${receipt.transactionHash}`;
    } catch (error) {
      console.error('Token launch error:', error);
      return 'Failed to launch token. Please verify parameters and try again.';
    }
  }
};

type BuyTokensArgs = {
  tokenAddress: string;
  amount: string;
};

export const pumpFlowBuyTool: ToolConfig = {
  definition: {
    type: 'function',
    function: {
      name: 'buy_pump_tokens',
      description: 'Buy meme tokens with Flow',
      parameters: {
        type: 'object',
        properties: {
          tokenAddress: {
            type: 'string',
            description: 'Address of the token to buy'
          },
          amount: {
            type: 'string',
            description: 'Amount of Flow to spend (e.g. "1", "0.5")'
          }
        },
        required: ['tokenAddress', 'amount']
      }
    }
  },
  handler: async (args: BuyTokensArgs) => {
    try {
      const contract = setupContract();
      const provider = contract.provider;

      const gasPrice = await provider.getGasPrice();
      const adjustedGasPrice = gasPrice.mul(120).div(100);

      const tx = await contract.buyTokens(
        args.tokenAddress,
        ethers.utils.parseEther(args.amount),
        {
          value: ethers.utils.parseEther(args.amount),
          gasLimit: 500000,
          gasPrice: adjustedGasPrice
        }
      );

      const receipt = await tx.wait();
      return `Successfully bought tokens. Transaction hash: ${receipt.transactionHash}`;
    } catch (error) {
      console.error('Token purchase error:', error);
      return 'Failed to buy tokens. Please verify parameters and try again.';
    }
  }
};

type SellTokensArgs = {
  tokenAddress: string;
  amount: string;
};

export const pumpFlowSellTool: ToolConfig = {
  definition: {
    type: 'function',
    function: {
      name: 'sell_pump_tokens',
      description: 'Sell meme tokens for Flow',
      parameters: {
        type: 'object',
        properties: {
          tokenAddress: {
            type: 'string',
            description: 'Address of the token to sell'
          },
          amount: {
            type: 'string',
            description: 'Amount of tokens to sell'
          }
        },
        required: ['tokenAddress', 'amount']
      }
    }
  },
  handler: async (args: SellTokensArgs) => {
    try {
      const contract = setupContract();
      const provider = contract.provider;

      const gasPrice = await provider.getGasPrice();
      const adjustedGasPrice = gasPrice.mul(120).div(100);

      const tx = await contract.sellTokens(
        args.tokenAddress,
        ethers.utils.parseEther(args.amount),
        {
          gasLimit: 500000,
          gasPrice: adjustedGasPrice
        }
      );

      const receipt = await tx.wait();
      return `Successfully sold tokens. Transaction hash: ${receipt.transactionHash}`;
    } catch (error) {
      console.error('Token sale error:', error);
      return 'Failed to sell tokens. Please verify parameters and try again.';
    }
  }
};

export const pumpFlowListTool: ToolConfig = {
  definition: {
    type: 'function',
    function: {
      name: 'list_pump_tokens',
      description: 'List all available meme tokens',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  handler: async () => {
    try {
      return await listTokens();
    } catch (error: any) {
      console.error('Token list error:', error);
      return 'Failed to list tokens. Please try again.';
    }
  }
};