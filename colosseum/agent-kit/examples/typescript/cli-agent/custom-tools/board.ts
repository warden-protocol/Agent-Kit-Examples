import * as chains from "viem/chains";
import { wagmiAbi } from "./abi";
import { z } from "zod";
import { createPublicClient, http } from "viem";
import { contract_address } from "./address";

// Zod schema for input validation (x and y coordinates for the board position)
export const getBoardInput = z.object({
    x: z.number().min(0).max(7), // X coordinate (0-7)
    y: z.number().min(0).max(7), // Y coordinate (0-7)
});

// Define mapping for PieceType enum
const pieceTypeMapping = {
    0: "Empty",  // No piece
    1: "Pawn",
    2: "Rook",
    3: "Knight",
    4: "Bishop",
    5: "Queen",
    6: "King"
};


// Define mapping for Color enum
const colorMapping = {
    0: "None",  // No color
    1: "White",
    2: "Black"
};


/**
 * Fetches a specific piece from the board based on x and y coordinates.
 *
 * @param args - The input arguments containing x and y coordinates.
 * @returns A message containing the piece details (pieceType, color, hasMoved).
 */
export async function getBoard(
    args: z.infer<typeof getBoardInput>
): Promise<string> {
    try {
        const publicClient = createPublicClient({
            chain: chains.sepolia,
            transport: http(),
        });

        const { x, y } = args; // Extract x and y coordinates from input

        // Read the specific `Piece` at the given coordinates (x, y) from the contract
        const piece = await publicClient.readContract({
            address: contract_address, // Contract address
            abi: wagmiAbi,  // ABI
            functionName: 'board',
            args: [BigInt(x), BigInt(y)],   // Pass the x and y coordinates to the contract function
        });

        /// Destructure the piece array returned by the contract into pieceType, color, and hasMoved
        const pieceType = piece[0];
        const color = piece[1];
        const hasMoved = piece[2];

// Return the results
return `Piece: ${pieceType}, Color: ${color}, Has Moved: ${hasMoved}`;
    } catch (error) {
        throw new Error(`Failed to fetch the piece at (${args.x}, ${args.y}): ${error}`);
    }
}
