export const sarthakTool = {
    name: "sarthakTool",
    description: "A tool to get the current price of aave",
    parameters: {
        type: "object",
        properties: {
            symbol: { type: "string", description: "The symbol of the asset" }
        },
        required: ["symbol"]
    }
};