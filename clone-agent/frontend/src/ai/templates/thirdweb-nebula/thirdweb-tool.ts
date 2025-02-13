import { ToolConfig } from "../index";
import { nebulaService } from "./initialise";

type ThirdWebQueryArgs = {
  query: string;
};

export const thirdwebTool: ToolConfig = {
  definition: {
    type: "function",
    function: {
      name: "query_thirdweb",
      description:
        "Query blockchain data or perform actions using ThirdWeb Nebula API",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              'The query or action to perform (e.g. "query 0x... on eth sepolia" or "deploy contract...")',
          },
        },
        required: ["query"],
      },
    },
  },
  handler: async (args: ThirdWebQueryArgs) => {
    try {
      const response = await nebulaService.processChat(args.query);
      return response || "No response from ThirdWeb API";
    } catch (error) {
      console.error("ThirdWeb query error:", error);
      return "Failed to process ThirdWeb query. Please check your input and try again.";
    }
  },
};
