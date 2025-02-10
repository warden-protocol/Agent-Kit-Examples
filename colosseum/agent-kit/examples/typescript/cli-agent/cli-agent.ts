import { WardenAgentKit } from "@wardenprotocol/warden-agent-kit-core";
import { WardenToolkit, WardenTool } from "@wardenprotocol/warden-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
// import { ChatOllama } from "@langchain/ollama";
import * as dotenv from "dotenv";
import * as readline from "readline";


import { joinGame, joinGameInput } from "./custom-tools/join_game";
import { makeMove, makeMoveInput } from "./custom-tools/make_move";
import { resignGame, resignGameInput } from "./custom-tools/resign_game";
//import { initializeBoard, initializeBoardInput } from "./custom-tools/initialize_board";
//import { isAddress, getAddress } from 'ethers';
import { getBlackPlayer, getBlackPlayerInput } from "./custom-tools/blackPlayer";
import { getWhitePlayer, getWhitePlayerInput } from "./custom-tools/whitePlayer";
import { getCurrentTurn, getCurrentTurnInput } from "./custom-tools/currentTurn";
import { getGameStarted, getGameStartedInput } from "./custom-tools/gameStarted";
import { getGameOver, getGameOverInput } from "./custom-tools/gameOver";
import { getBoard, getBoardInput } from "./custom-tools/board";
//import { primaryChain } from "@wardenprotocol/warden-agent-kit-core/typescript/src/utils/chains.ts";

dotenv.config();

/**
 * Initialize the agent with Warden Agent Kit
 *
 * @returns Agent executor and config
 */
// async function initializeAgent() {
//     try {
//         // Initialize LLM
//         const llm = new ChatOpenAI({
//             model: "gpt-4o-mini",
//         });

//         // const llm = new ChatOpenAI(
//         //     {
//         //         modelName: "google/gemini-2.0-flash-exp:free",
//         //         openAIApiKey: process.env.OPENROUTER_API_KEY,
//         //     },
//         //     {
//         //         basePath: "https://openrouter.ai/api/v1",
//         //     }
//         // );

//         // const llm = new ChatOllama({
//         //     model: "llama-3.2-3b",
//         //     temperature: 0,
//         //     maxRetries: 2,
//         //     baseUrl: "https://ai.devnet.wardenprotocol.org/openai/v1",
//         // });

//         // const llm = new ChatOpenAI({
//         //     modelName: "llama-3.1-8b-instruct-fp8-l4",
//         //     temperature: 0,
//         //     maxRetries: 2,
//         //     apiKey: "thisIsIgnored",
//         //     configuration: {
//         //         baseURL: "https://ai.devnet.wardenprotocol.org/openai/v1",
//         //     },
//         // });

//         // Configure Warden Agent Kit
//         const config = {
//             privateKeyOrAccount:
//                 (process.env.PRIVATE_KEY as `0x${string}`) || undefined,
//         };

//         // Initialize Warden Agent Kit
//         const agentkit = new WardenAgentKit(config);

//         // Initialize Warden Agent Kit Toolkit and get tools
//         const wardenToolkit = new WardenToolkit(agentkit);
//         const tools = wardenToolkit.getTools();

//         const joinGameTool = new WardenTool({
//             name: "join_game",
//             description: "This tool should be called when a user wants to join the game of chess",
//             schema: joinGameInput, // there arent any inputs to the function to be called so no schema 
//             function :joinGame,
//         },agentkit);
        
//         const makeMoveTool = new WardenTool({
//             name: "make_move",
//             description: "This tool should be called when a user wants to make a move, for that he needs to give the initial x and y coordinates which are the from coordinates of the piece and also the final x and y coordinates which are the to coordinates  to which the piece is to be moved ",
//             schema: makeMoveInput, // there arent any inputs to the function to be called so no schema 
//             function :makeMove,
//         },agentkit);
        
//         const resignGameTool = new WardenTool({
//             name: "resign_game",
//             description: "This tool should be called when a user wants to resign from the game",
//             schema: resignGameInput, // there arent any inputs to the function to be called so no schema 
//             function :resignGame,
//         },agentkit);

//         // const initializeBoardTool = new WardenTool({
//         //     name: "initialze_board",
//         //     description: "This tool should be called when a user wants to initialise a new board",
//         //     schema: joinGameInput, // there arent any inputs to the function to be called so no schema 
//         //     function :joinGame,
//         // },agentkit);

//         const getBlackPlayerTool = new WardenTool({
//             name: "black-player",
//             description: "This tool should be called when a user wants to query the address of the blackPlayer. To check if i am the blackPlayer compare my address with that of the blackPlayer, if it matches then i am the blackPlayer otherwise i am the whitePlayer",
//             schema: getBlackPlayerInput, // there arent any inputs to the function to be called so no schema 
//             function :getBlackPlayer,
//         },agentkit);

//         const getWhitePlayerTool = new WardenTool({
//             name: "white-player",
//             description: "This tool should be called when a user wants to query the address of the whitePlayer. To check if i am the whitePlayer compare my address with that of the whitePlayer, if it matches then i am the whitePlayer otherwise i am the blackPlayer",
//             schema: getWhitePlayerInput, // there arent any inputs to the function to be called so no schema 
//             function :getWhitePlayer,
//         },agentkit);

//         const getCurrentTurnTool = new WardenTool({
//             name: "current-turn",
//             description: "This tool should be called when a user wants to query the current turn, if the retured value is 1 then it is the turn of the whitePlayer, otherwise if 0 is returned then it is the turn of the blackPlayer. to know if it is your turn check your address with that of the blackPlayer's address and the whitePlayer's address. Your color will be the one which matches with your address",
//             schema: getCurrentTurnInput, // No input required
//             function: getCurrentTurn,
//         }, agentkit);
//         const getGameStartedTool = new WardenTool({
//             name: "game-started",
//             description: "This tool should be called when a user wants to know if the game is active or not, if true is returned then the game is active and you can make a move if it is your turn",
//             schema: getGameStartedInput, // No input required
//             function: getGameStarted,
//         }, agentkit);

//         const getGameOverTool = new WardenTool({
//             name: "game-over",
//             description: "This tool should be called when a user wants to know if the game is still active or it has ended, if true is returned then the game is over and you first need to join the game in order to play it",
//             schema: getGameOverInput, // No input required
//             function: getGameOver,
//         }, agentkit);

//         const getBoardTileStatusTool = new WardenTool({
//             name: "game-over",
//             description: "This tool should be called when a user wants to query the pieceType, color of that piece and if the piece has moved and a particular tile on the chess board with the coordinates (x,y) where x and y are to be given as the input for the file.",
//             schema: getGameOverInput, // No input required
//             function: getGameOver,
//         }, agentkit);
        
//         tools.push(joinGameTool,makeMoveTool,resignGameTool,getBlackPlayerTool, getWhitePlayerTool, getCurrentTurnTool, getGameStartedTool, getGameOverTool, getBoardTileStatusTool);

//         // Store buffered conversation history in memory
//         const memory = new MemorySaver();
//         const agentConfig = {
//             configurable: { thread_id: "Warden Agent Kit CLI Agent Example!" },
//         };

        
//         // Create React Agent using the LLM and Warden Agent Kit tools
//         const agent = createReactAgent({
//             llm,
//             tools,
//             checkpointSaver: memory,
//             messageModifier:
//                 "You're a helpful assistant that can help with a variety of tasks related to web3 tranactions." +
//                 "You should only use the provided tools to carry out tasks, interperate the users input" +
//                 "and select the correct tool to use for the required tasks or tasks.",
//         });

//         return { agent, config: agentConfig };
//     } catch (error) {
//         console.error("Failed to initialize agent:", error);
//         throw error; // Re-throw to be handled by caller
//     }
// }
// agent initialised till here 

export async function initializeAgent(modelName: string, apiKey: string) {
  try {
    // Initialize LLM based on user selection
    let llm;
    switch (modelName.toLowerCase()) {
      case 'gpt-4o-mini':
        llm = new ChatOpenAI({
          model: "gpt-4o-mini",
          openAIApiKey: apiKey
        });
        break;

      case 'gemini':
        llm = new ChatOpenAI({
          modelName: "google/gemini-2.0-flash-exp:free",
          openAIApiKey: apiKey
        }, {
          basePath: "https://openrouter.ai/api/v1"
        });
        break;

        // case 'ollama':
        //   llm = new ChatOllama({
        //     model: "llama-3.2-3b",
        //     temperature: 0,
        //     maxRetries: 2,
        //     baseUrl: "https://ai.devnet.wardenprotocol.org/openai/v1"
        //   });
        break;

      case 'llama-3.1-8b':
        llm = new ChatOpenAI({
          modelName: "llama-3.1-8b-instruct-fp8-l4",
          temperature: 0,
          maxRetries: 2,
          apiKey: "thisIsIgnored", // API key not required for this endpoint
          configuration: {
            baseURL: "https://ai.devnet.wardenprotocol.org/openai/v1"
          }
        });
        break;

      default:
        throw new Error(`Unsupported model: ${modelName}`);
    }
    const config = {
      privateKeyOrAccount:
        (process.env.PRIVATE_KEY as `0x${string}`) || undefined,
    };
    const agentkit = new WardenAgentKit(config);
    const wardenToolkit = new WardenToolkit(agentkit);
    const tools = wardenToolkit.getTools();
    // Rest of the original initialization logic remains the same
    const joinGameTool = new WardenTool({
      name: "join_game",
      description: "This tool should be called when a user wants to join the game of chess",
      schema: joinGameInput, // there arent any inputs to the function to be called so no schema 
      function: joinGame,
    }, agentkit);

    const makeMoveTool = new WardenTool({
      name: "make_move",
      description: "This tool should be called when a user wants to make a move, for that he needs to give the initial x and y coordinates which are the from coordinates of the piece and also the final x and y coordinates which are the to coordinates  to which the piece is to be moved ",
      schema: makeMoveInput, // there arent any inputs to the function to be called so no schema 
      function: makeMove,
    }, agentkit);

    const resignGameTool = new WardenTool({
      name: "resign_game",
      description: "This tool should be called when a user wants to resign from the game",
      schema: resignGameInput, // there arent any inputs to the function to be called so no schema 
      function: resignGame,
    }, agentkit);

    // const initializeBoardTool = new WardenTool({
    //     name: "initialze_board",
    //     description: "This tool should be called when a user wants to initialise a new board",
    //     schema: joinGameInput, // there arent any inputs to the function to be called so no schema 
    //     function :joinGame,
    // },agentkit);

    const getBlackPlayerTool = new WardenTool({
      name: "black-player",
      description: "This tool should be called when a user wants to query the address of the blackPlayer. To check if i am the blackPlayer compare my address with that of the blackPlayer, if it matches then i am the blackPlayer otherwise i am the whitePlayer",
      schema: getBlackPlayerInput, // there arent any inputs to the function to be called so no schema 
      function: getBlackPlayer,
    }, agentkit);

    const getWhitePlayerTool = new WardenTool({
      name: "white-player",
      description: "This tool should be called when a user wants to query the address of the whitePlayer. To check if i am the whitePlayer compare my address with that of the whitePlayer, if it matches then i am the whitePlayer otherwise i am the blackPlayer",
      schema: getWhitePlayerInput, // there arent any inputs to the function to be called so no schema 
      function: getWhitePlayer,
    }, agentkit);

    const getCurrentTurnTool = new WardenTool({
      name: "current-turn",
      description: "This tool should be called when a user wants to query the current turn, if the retured value is 1 then it is the turn of the whitePlayer, otherwise if 0 is returned then it is the turn of the blackPlayer. to know if it is your turn check your address with that of the blackPlayer's address and the whitePlayer's address. Your color will be the one which matches with your address",
      schema: getCurrentTurnInput, // No input required
      function: getCurrentTurn,
    }, agentkit);
    const getGameStartedTool = new WardenTool({
      name: "game-started",
      description: "This tool should be called when a user wants to know if the game is active or not, if true is returned then the game is active and you can make a move if it is your turn",
      schema: getGameStartedInput, // No input required
      function: getGameStarted,
    }, agentkit);

    const getGameOverTool = new WardenTool({
      name: "game-over",
      description: "This tool should be called when a user wants to know if the game is still active or it has ended, if true is returned then the game is over and you first need to join the game in order to play it",
      schema: getGameOverInput, // No input required
      function: getGameOver,
    }, agentkit);

    const getBoardTileStatusTool = new WardenTool({
      name: "game-over",
      description: "This tool should be called when a user wants to query the pieceType, color of that piece and if the piece has moved and a particular tile on the chess board with the coordinates (x,y) where x and y are to be given as the input for the file.",
      schema: getGameOverInput, // No input required
      function: getGameOver,
    }, agentkit);

    tools.push(joinGameTool, makeMoveTool, resignGameTool, getBlackPlayerTool, getWhitePlayerTool, getCurrentTurnTool, getGameStartedTool, getGameOverTool, getBoardTileStatusTool);

    // Store buffered conversation history in memory
    const memory = new MemorySaver();
    const agentConfig = {
      configurable: { thread_id: "Warden Agent Kit CLI Agent Example!" },
    };


    // Create React Agent using the LLM and Warden Agent Kit tools
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier:
        "You're a helpful assistant that can help with a variety of tasks related to web3 tranactions." +
        "You should only use the provided tools to carry out tasks, interperate the users input" +
        "and select the correct tool to use for the required tasks or tasks.",
    });




    // ... rest of the tool initialization code ...

    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}
  /**
   * Run the agent autonomously with specified intervals
   *
   * @param agent - The agent executor
   * @param config - Agent configuration
   * @param interval - Time interval between actions in seconds
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export async function runAutonomousMode(agent: any, config: any, interval = 10) {
    console.log("Starting autonomous mode...");
  
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const thought = 
        "You are an AI agent playing a game of chess. " +
        "Your primary goal is to play strategically and make the best possible moves. " +
        "If the game hasn't started, join it first. The game begins when the other player joins. " +
        "You can check if the game has started using the 'gameStarted' function. " +
        "Once the game is active, analyze the board and make strategic moves using the 'makeMove' function. " +
        "You can query the board's state, check whose turn it is, and see the players' addresses through viewing functions. " +
        "when you are waiting for other player to move wait 15 seconds before querrying the board's states "
        "If the situation becomes hopeless, you have the option to resign, but aim to play skillfully. " +
        "Ensure you choose the best action for each turn, considering both the current board state and potential future moves. " +
        "You can check if the game has ended using the 'gameOver' function. " +
        "Available actions include: joining the game, making a move, and resigning.";
  
        const stream = await agent.stream({ messages: [new HumanMessage(thought)] }, config);
  
        for await (const chunk of stream) {
          if ("agent" in chunk) {
            console.log(chunk.agent.messages[0].content);
          } else if ("tools" in chunk) {
            console.log(chunk.tools.messages[0].content);
          }
          console.log("-------------------");
        }
  
        await new Promise(resolve => setTimeout(resolve, interval * 1000));
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        }
        process.exit(1);
      }
    }
  }
  

export async function runChatMode(agent: any, config: any) {
    console.log("Starting chat mode... Type 'exit' to end.");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const question = (prompt: string): Promise<string> =>
        new Promise((resolve) => rl.question(prompt, resolve));

    try {
        while (true) {
            const userInput = await question("\nPrompt: ");

            if (userInput.toLowerCase() === "exit") {
                break;
            }

            const stream = await agent.stream(
                { messages: [new HumanMessage(userInput)] },
                config
            );

            for await (const chunk of stream) {
                if ("agent" in chunk) {
                    console.log(chunk.agent.messages[0].content);
                } else if ("tools" in chunk) {
                    console.log(chunk.tools.messages[0].content);
                }
                console.log("-------------------");
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        process.exit(1);
    } finally {
        rl.close();
    }
}



  /**
   * Choose whether to run in autonomous or chat mode based on user input
   *
   * @returns Selected mode
   */
  async function chooseMode(): Promise<"chat" | "auto"> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    const question = (prompt: string): Promise<string> =>
      new Promise(resolve => rl.question(prompt, resolve));
  
    // eslint-disable-next-line no-constant-condition
    while (true) {
      console.log("\nAvailable modes:");
      console.log("1. chat    - Interactive chat mode");
      console.log("2. auto    - Autonomous action mode");
  
      const choice = (await question("\nChoose a mode (enter number or name): "))
        .toLowerCase()
        .trim();
  
      if (choice === "1" || choice === "chat") {
        rl.close();
        return "chat";
      } else if (choice === "2" || choice === "auto") {
        rl.close();
        return "auto";
      }
      console.log("Invalid choice. Please try again.");
    }
  }

/**
 * Start the chatbot agent
 */
async function main() {
    try {
        const { agent, config } = await initializeAgent("gpt-4o-mini", process.env.OPENAI_API_KEY as string);
        const mode = await chooseMode();
       // await runChatMode(agent, config);
       if (mode === "chat") {
        await runChatMode(agent, config);
      } else {
        await runAutonomousMode(agent, config);
      }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        process.exit(1);
    }
}

if (require.main === module) {
    console.log("Starting Agent...");
    main().catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    });
}
