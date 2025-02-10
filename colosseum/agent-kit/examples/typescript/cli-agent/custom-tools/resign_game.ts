import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http, createWalletClient, Account, Chain, ChainDisconnectedError } from "viem";
import { contract_address } from "./address";


// Add the custom tool

//custom tool input schema 
export const resignGameInput = z.object({
    keyId: z.number().positive(),
});


// Add the custom tool
export const resignGame = async (
    account: Account,
    args: z.infer<typeof resignGameInput>// these are the inputs for this ts function call and will be filled in by the ai agent 
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
  
      // Send the transaction to the blockchain using the wallet client
      const hash = await walletClient.writeContract({
        address: contract_address,
        abi: wagmiAbi,
        functionName: 'resignGame',
        account,
      });
  
      // Wait for the transaction receipt using the public client
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });
  
      // Check if the transaction was successful
      if (receipt.status === "success") {
        return `Successfully resign from the game. Transaction hash: ${receipt.transactionHash}`;
      } else {
        throw new Error("Transaction failed, coudln't resign from the game");
      }
    } catch (error) {
      return `Error resigning: ${error}`;
    }
  };
  