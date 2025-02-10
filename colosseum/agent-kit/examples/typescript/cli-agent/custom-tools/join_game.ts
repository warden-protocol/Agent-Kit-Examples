// import * as chains from "viem/chains";
// import { wagmiAbi } from "./abi";
// import { z } from "zod";
// import { createPublicClient, http, createWalletClient, Account, Chain, ChainDisconnectedError } from "viem";
// import { contract_address } from "./address";
// import * as dotenv from "dotenv";

// dotenv.config();

// // Add the custom tool

// //custom tool input schema 
// export const joinGameInput = z.object({
//     keyId: z.number().positive(),
// });


// // Add the custom tool
// export const joinGame = async (
//     account: Account,
//     args: z.infer<typeof joinGameInput>// these are the inputs for this ts function call and will be filled in by the ai agent 
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
  
//       // Send the transaction to the blockchain using the wallet client
//       const hash = await walletClient.writeContract({
//         address: contract_address,
//         abi: wagmiAbi,
//         functionName: 'joinGame',
//         account,
//       });
  
//       // Wait for the transaction receipt using the public client
//       const receipt = await publicClient.waitForTransactionReceipt({
//         hash,
//       });
  
//       // Check if the transaction was successful
//       if (receipt.status === "success") {
//         return `Successfully joined the game. Transaction hash: ${receipt.transactionHash}`;
//       } else {
//         throw new Error("Transaction failed, coudln't join the game");
//       }
//     } catch (error) {
//       return `Error joining game : ${error}`;
//     }
//   };
import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http, createWalletClient, Account, ChainDisconnectedError } from "viem";
import { contract_address } from "./address";
import * as dotenv from "dotenv";

dotenv.config();

// Custom tool input schema
export const joinGameInput = z.object({
  keyId: z.number().positive(),
});

// Poll for the event with retries
async function pollForEvent(publicClient: any, filter: any, maxRetries = 100, delay = 3000): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    // Get event logs (changes) since the filter was created
    const logs = await publicClient.getFilterChanges({ filter });

    if (logs.length > 0) {
      return true; // Event was found
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return false; // Event was not found within the retries
}

// Updated joinGame function
export const joinGame = async (
  account: Account,
  args: z.infer<typeof joinGameInput> // Inputs for the function call
): Promise<string> => {
  try {
    // Create a public client (for reading data from the blockchain)
    console.log("started joining");
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
    console.log("trying joining");
    console.log({account});
    // Send the transaction to the blockchain using the wallet client
    // const {request} = await publicClient.simulateContract({
    //   address: contract_address,
    //   abi: wagmiAbi,
    //   functionName: 'joinGame',
    //   account,
    // });
    // console.log({request});
    // const hash=await walletClient.writeContract(request)
    const hash = await walletClient.writeContract({
              address: contract_address,
              abi: wagmiAbi,
              functionName: 'joinGame',
              account,
            });
    console.log("trying hash generation ");
    console.log(hash);
    // Wait for the transaction receipt using the public client
    console.log("hash generation tried");
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
    });
    console.log("hash generation tried");

    // Check if the transaction was successful
    if (receipt.status !== "success") {
      throw new Error("Transaction failed, couldn't join the game");
    }

    // Query the public variable 'gameStarted' from the contract
    const gameStarted: boolean = await publicClient.readContract({
      address: contract_address,
      abi: wagmiAbi,
      functionName: 'gameStarted', // Assuming 'gameStarted' is a public variable in your contract
    });

    // If the game has started, return the success message
    if (gameStarted) {
      return `Successfully joined the game. Transaction hash: ${receipt.transactionHash}. The game has started!`;
    }

    // If the game has not started (gameStarted === 0), wait for the 'JoinedGame' event
    const filter = await publicClient.createContractEventFilter({
      abi: wagmiAbi,
      address: contract_address,
      eventName: 'JoinedGame', // Replace 'JoinedGame' with the actual event name
    });

    // Poll for the event
    const eventReceived = await pollForEvent(publicClient, filter);

    if (eventReceived) {
      return `Successfully joined the game. Transaction hash: ${receipt.transactionHash}. The game has now started after the event was emitted.`;
    } else {
      return `Successfully joined the game, but did not receive the game start event within the time limit.`;
    }

  } catch (error) {
    console.log(error);
    return `Error joining game `;
  }
};
