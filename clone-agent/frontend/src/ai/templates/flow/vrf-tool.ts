import { ToolConfig } from "../index"
import { ethers } from "ethers"
import { FLOW_RANDOM_ABI } from "../../utils"

const PRIVATE_KEY = process.env.FLOW_KEY?.toString() || ""
console.log(PRIVATE_KEY);
const RPC_URL = "https://testnet.evm.nodes.onflow.org"
const contractAddress = "0xbDe037993Fdc44EB8fbb7EBcB19f8b4B004aBeAe"

const network = {
    name: "flow-testnet",
    chainId: 545,
}

const provider = new ethers.providers.JsonRpcProvider(RPC_URL, network);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, FLOW_RANDOM_ABI, wallet);

export const vrfTool: ToolConfig = {
  definition: {
    type: "function",
    function: {
      name: "query_vrf",
      description: "Query the VRF service to generate a random number between a range. [Give Transaction Hash]",
      parameters: {
        type: "object",
        properties: {
          min: {
            type: "number",
            description: "Minimum value of the range (e.g. 1)",
          },
          max: {
            type: "number",
            description: "Maximum value of the range (e.g. 100)",
          },
        },
        required: ["min", "max"],
      },
    },
  },
  handler: async (args: { min: number; max: number }): Promise<string> => {
    console.log(
      `[VRF Tool] Querying VRF service to generate a random number between ${args.min} and ${args.max}`,
    )
    return vrfService(args.min, args.max).toString()
  },
}

async function vrfService(min: number, max: number) {
    try {
        console.log(`Generating random number between ${min} and ${max}...`);
        const tx = await contract.getRandomInRange(min, max, {
            gasLimit: 500000
        });
        
        console.log("Transaction Hash:", tx.hash);
        console.log("View on Explorer:", `https://evm-testnet.flowscan.io/tx/${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);
        
        const event = receipt.events?.find((event: any) => event.event === 'RandomInRangeGenerated');
        
        if (event) {
            const randomNumber = event.args.randomNumber;
            console.log("Random number generated:", randomNumber.toString());
            return `
                randomNumber: ${randomNumber.toString()},
                txHash: ${tx.hash},
                blockNumber: ${receipt.blockNumber},
                min: ${min},
                max: ${max}
            `;
        }
    } catch (error) {
        console.error("Error generating random number in range:", error);
        throw error;
    }
}