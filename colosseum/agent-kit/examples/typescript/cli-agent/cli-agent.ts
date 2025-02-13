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
import { pickRunnableConfigKeys } from "@langchain/core/runnables";


dotenv.config();

/**
 * Initialize the agent with Warden Agent Kit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
    try {
        // Initialize LLM
        const llm = new ChatOpenAI({
            model: "gpt-4o",
            temperature: 0.3,
            
        });
   
        // const llm = new ChatOpenAI(
        //     {
        //         modelName: "google/gemini-2.0-flash-exp:free",
        //         openAIApiKey: process.env.OPENROUTER_API_KEY,
        //     },
        //     {
        //         basePath: "https://openrouter.ai/api/v1",
        //     }
        // );

        // const llm = new ChatOllama({
        //     model: "llama-3.2-3b",
        //     temperature: 0,
        //     maxRetries: 2,
        //     baseUrl: "https://ai.devnet.wardenprotocol.org/openai/v1",
        // });

        // const llm = new ChatOpenAI({
        //     modelName: "llama-3.1-8b-instruct-fp8-l4",
        //     temperature: 0,
        //     maxRetries: 2,
        //     apiKey: "thisIsIgnored",
        //     configuration: {
        //         baseURL: "https://ai.devnet.wardenprotocol.org/openai/v1",
        //     },
        // });

        // Configure Warden Agent Kit
        const config = {
            privateKeyOrAccount:
                (process.env.PRIVATE_KEY as `0x${string}`) || undefined,
        };

        const agentkit = new WardenAgentKit(config);

        // Initialize Warden Agent Kit Toolkit and get tools
        const wardenToolkit = new WardenToolkit(agentkit);
        const tools = wardenToolkit.getTools();

        const joinGameTool = new WardenTool({
            name: "join_game",
            description: "This tool should be called when a user wants to join the game of chess",
            schema: joinGameInput, // there arent any inputs to the function to be called so no schema 
            function :joinGame,
        },agentkit);
        
        const makeMoveTool = new WardenTool({
            name: "make_move",
            description: "This tool should be called when a user wants to make a move, for that he needs to give the initial x and y coordinates which are the from coordinates of the piece and also the final x and y coordinates which are the to coordinates  to which the piece is to be moved ",
            schema: makeMoveInput, // there arent any inputs to the function to be called so no schema 
            function :makeMove,
        },agentkit);
        
        const resignGameTool = new WardenTool({
            name: "resign_game",
            description: "This tool should be called when a user wants to resign from the game",
            schema: resignGameInput, // there arent any inputs to the function to be called so no schema 
            function :resignGame,
        },agentkit);

        const getBlackPlayerTool = new WardenTool({
            name: "black-player",
            description: "This tool should be called when a user wants to query the address of the blackPlayer. To check if i am the blackPlayer compare my address with that of the blackPlayer, if it matches then i am the blackPlayer otherwise i am the whitePlayer",
            schema: getBlackPlayerInput, // there arent any inputs to the function to be called so no schema 
            function :getBlackPlayer,
        },agentkit);

        const getWhitePlayerTool = new WardenTool({
            name: "white-player",
            description: "This tool should be called when a user wants to query the address of the whitePlayer. To check if i am the whitePlayer compare my address with that of the whitePlayer, if it matches then i am the whitePlayer otherwise i am the blackPlayer",
            schema: getWhitePlayerInput, // there arent any inputs to the function to be called so no schema 
            function :getWhitePlayer,
        },agentkit);

        const getCurrentTurnTool = new WardenTool({
            name: "current-turn",
            description: "This tool should be called when a user wants to query the current turn, if the retured value is 1 then it is the turn of the whitePlayer, otherwise if 2 is returned then it is the turn of the blackPlayer. to know if it is your turn check your address with that of the blackPlayer's address and the whitePlayer's address. Your color will be the one which matches with your address",
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
            name: "board",
            description: "This tool should be called when a user wants to query the pieceType, color of that piece and if the piece has moved and a particular tile on the chess board with the coordinates (x,y) where x and y are to be given as the input for the file.",
            schema: getBoardInput, // No input required
            function: getBoard,
        }, agentkit);

        tools.push(joinGameTool,makeMoveTool,resignGameTool);// you can add other custom tools if you want from here
        
        //tools.push(joinGameTool,makeMoveTool,resignGameTool,getBlackPlayerTool, getWhitePlayerTool, getCurrentTurnTool, getGameStartedTool, getGameOverTool, getBoardTileStatusTool);
        // remove the unessary capabilities by removing them from this list of tools

        // Store buffered conversation history in memory
        const memory = new MemorySaver();
        const agentConfig = {
            configurable: { thread_id: "Warden Agent Kit CLI Agent Example!",
             // pickRunnableConfigKeys
            },
        };

        
        
      
        const agent = createReactAgent({
            llm,
            tools,
            checkpointSaver: memory,
            messageModifier:

"You're an AI agent responsible for playing a game of chess. " +
        "You should only use the provided tools to perform actions related to chess. " +
        
        "Here are the tasks you can perform:" +

        "1. joinGame Tool: Whenever you are initialised you have to first join the game using the join_game tool this is required to play the chess game"+  

        "2. makeMoveTool : Now that you have joined the game so its your turn , you have to think about possible move you can make use the 'make_move' tool to move a piece by specifying the initial and final coordinates of the piece carefully"+ "you need to think carefully which move to make, ensure that the move you make is valid, if not valid then you can think of some other move"+"remember one thing that the indexing of the tiles on this chess board are from 0 to 7 instead of 1 to 8"+"you need to imagince the chess board and remeber the moves you made and what kind of moves you made "+
         "You have to use this tool i.e the makeMove tool after every 30 seconds , note that you should not call this function before 15 seconds "+

         "3. resignGameTool : If you want to resign from the game, use the 'resign_game' tool." +
       "4. you are not allowed to create a new space or a new key, use the existing ones itself"
      
        });

        return { agent, config: agentConfig };
    } catch (error) {
        console.error("Failed to initialize agent:", error);
        throw error; // Re-throw to be handled by caller
    }
}
// agent initialised till here 


  /**
   * Run the agent autonomously with specified intervals
   *
   * @param agent - The agent executor
   * @param config - Agent configuration
   * @param interval - Time interval between actions in seconds
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function runAutonomousMode(agent: any, config: any, interval = 30) {
    console.log("Starting autonomous mode...");
  
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        
        const thought = 
    "You are an AI agent playing a game of chess. " + "Choose an action or set of actions and execute it"+
        "Remember, your primary objective is to play strategically and win the game by making smart moves when it's your turn. " +
        "You are responsible for joining the game , making valid moves .";

        
        const stream = await agent.stream({ messages: [new HumanMessage(thought)] }, config);
  
        for await (const chunk of stream) {
          if ("agent" in chunk) {
            console.log(chunk.agent.messages[0].content);
          } else if ("tools" in chunk) {
            console.log(chunk.tools.messages[0].content);
          }
          console.log("-------------------");
        }
  
        await new Promise(resolve => setTimeout(resolve, interval * 1000));// here either give the commands in a specific sequence 
        // or listen to events 
        
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        }
        process.exit(1);
      }
    }
  }


async function runChatMode(agent: any, config: any) {
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
        const { agent, config } = await initializeAgent();
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
