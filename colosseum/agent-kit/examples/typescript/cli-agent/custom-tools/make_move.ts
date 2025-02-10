// import * as chains from "viem/chains";
// import { wagmiAbi } from "./abi";
// import { z } from "zod";
// import { createPublicClient, http, createWalletClient, Account, Chain, ChainDisconnectedError } from "viem";
// import { contract_address } from "./address";

// import * as dotenv from "dotenv";

// dotenv.config();
// // move type equivalent to solidity struct 
// type Move = {
//     fromX: number; // Corresponds to uint8 in Solidity
//     fromY: number; // Corresponds to uint8 in Solidity
//     toX: number;   // Corresponds to uint8 in Solidity
//     toY: number;   // Corresponds to uint8 in Solidity
// };

// // Zod schema for Move struct
// const moveSchema = z.object({
//     fromX: z.number().min(0).max(7), // Equivalent to uint8
//     fromY: z.number().min(0).max(7), // Equivalent to uint8
//     toX: z.number().min(0).max(7),   // Equivalent to uint8
//     toY: z.number().min(0).max(7),   // Equivalent to uint8
// });
// // Add the custom tool

// //custom tool input schema 
// export const makeMoveInput = z.object({
//     keyId: z.number().positive(),
//     move: moveSchema,
// });


// // Add the custom tool
// export const makeMove = async (
//     account: Account,
//     args: z.infer<typeof makeMoveInput>
//   ): Promise<string> => {
//     try {
//       // Create a public client (for reading data from the blockchain)
//       const publicClient = createPublicClient({
//         chain: chains.arbitrumSepolia,
//         transport: http(process.env.RPC_URL),
//       });
  
//       // Create a wallet client (for signing transactions)
//       const walletClient = createWalletClient({
//         account, // address of the key of the AI agent will be fetched automatically
//         chain: chains.arbitrumSepolia,
//         transport: http(process.env.RPC_URL),
//       });
      
//       const move: Move = args.move;
//       console.log(move);
//       // Send the transaction to the blockchain using the wallet client
//       const hash = await walletClient.writeContract({
//         address: contract_address,
//         abi: wagmiAbi,
//         functionName: 'makeMove',
//         args: [move],
//         account,
//       });
  
//       // Wait for the transaction receipt using the public client
//       const receipt = await publicClient.waitForTransactionReceipt({
//         hash,
//       });
  
//       // Check if the transaction was successful
//       if (receipt.status === "success") {
//         return `Successfully moved the piece. Transaction hash: ${receipt.transactionHash}`;
//       } else {
//         throw new Error("Transaction failed, couldn't make the move");
//       }
//     } catch (error) {
//       return `Error making the move: ${error}`;
//     }
//   };
import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http, createWalletClient, Account } from "viem";
import { contract_address } from "./address";
import * as dotenv from "dotenv";

dotenv.config();

// Move type equivalent to Solidity struct
type Move = {
  fromX: number; // Corresponds to uint8 in Solidity
  fromY: number; // Corresponds to uint8 in Solidity
  toX: number;   // Corresponds to uint8 in Solidity
  toY: number;   // Corresponds to uint8 in Solidity
};

// Zod schema for Move struct
const moveSchema = z.object({
  fromX: z.number().min(1).max(8), // Equivalent to uint8
  fromY: z.number().min(1).max(8), // Equivalent to uint8
  toX: z.number().min(1).max(8),   // Equivalent to uint8
  toY: z.number().min(1).max(8),   // Equivalent to uint8
});

// Custom tool input schema
export const makeMoveInput = z.object({
  keyId: z.number().positive(),
  move: moveSchema,
});

// Poll for the event with retries
async function pollForEvent(publicClient: any, filter: any, maxRetries = 100, delay = 3000): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    const logs = await publicClient.getFilterChanges({ filter });

    if (logs.length > 0) {
      return true; // Event was found
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return false; // Event was not found within the retries
}

// Updated makeMove function
export const makeMove = async (
  account: Account,
  args: z.infer<typeof makeMoveInput>
): Promise<string> => {
  try {
    // Create a public client (for reading data from the blockchain)
    const publicClient = createPublicClient({
      chain: chains.sepolia,
      transport: http(process.env.RPC_URL),
    });

    // Create a wallet client (for signing transactions)
    const walletClient = createWalletClient({
      account, // address of the AI agent's key
      chain: chains.sepolia,
      transport: http(process.env.RPC_URL),
    });

    // Query the currentTurn public variable to check if it's the AI agent's turn
    const currentTurn: number = await publicClient.readContract({
      address: contract_address,
      abi: wagmiAbi,
      functionName: 'currentTurn', // Assuming currentTurn is a public variable in your contract
    });

    // If it's not the AI agent's turn (currentTurn !== 1), wait for the MoveMade event
    if (currentTurn !== 1) {
      console.log("Not AI agent's turn. Waiting for the opponent to make a move...");

      const filter = await publicClient.createContractEventFilter({
        abi: wagmiAbi,
        address: contract_address,
        eventName: 'MoveMade', // Replace 'MoveMade' with the actual event name if different
      });

      // Poll for the MoveMade event
      const eventReceived = await pollForEvent(publicClient, filter);

      if (!eventReceived) {
        throw new Error("MoveMade event not received within the time limit.");
      }
      console.log("Opponent has made their move. Proceeding...");
    }

    // If it's AI agent's turn, proceed to make the move
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
    return `Error making the move`;
  }
};
