import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http, createWalletClient, Account, Chain, ChainDisconnectedError } from "viem";
import { contract_address } from "./address";


// move type equivalent to solidity struct 
type Move = {
    fromX: number; // Corresponds to uint8 in Solidity
    fromY: number; // Corresponds to uint8 in Solidity
    toX: number;   // Corresponds to uint8 in Solidity
    toY: number;   // Corresponds to uint8 in Solidity
};

// Zod schema for Move struct
const moveSchema = z.object({
    fromX: z.number().min(0).max(7), // Equivalent to uint8
    fromY: z.number().min(0).max(7), // Equivalent to uint8
    toX: z.number().min(0).max(7),   // Equivalent to uint8
    toY: z.number().min(0).max(7),   // Equivalent to uint8
});
// Add the custom tool

//custom tool input schema 
export const makeMoveInput = z.object({
    keyId: z.number().positive(),
    move: moveSchema,
});


// Add the custom tool
export const makeMove = async (
    account: Account,
    args: z.infer<typeof makeMoveInput>
  ): Promise<string> => {
    try {
      // Create a public client (for reading data from the blockchain)
      const publicClient = createPublicClient({
        chain: chains.sepolia,
        transport: http(),
      });
  
      // Create a wallet client (for signing transactions)
      const walletClient = createWalletClient({
        account, // address of the key of the AI agent will be fetched automatically
        chain: chains.sepolia,
        transport: http(),
      });
      
      const move: Move = args.move;
      console.log(move);
      // Send the transaction to the blockchain using the wallet client
      const hash = await walletClient.writeContract({
        address: contract_address,
        abi: wagmiAbi,
        functionName: 'makeMove',
        args: [move],
        account,
      });
  
      // Wait for the transaction receipt using the public client
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });
  
      // Check if the transaction was successful
      if (receipt.status === "success") {
        return `Successfully moved the piece. Transaction hash: ${receipt.transactionHash}`;
      } else {
        throw new Error("Transaction failed, couldn't make the move");
      }
    } catch (error) {
      return `Error making the move: ${error}`;
    }
  };
  