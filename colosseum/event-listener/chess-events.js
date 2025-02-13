import { createPublicClient, http, keccak256, toHex } from 'viem';
import { sepolia } from 'viem/chains';
import * as abiModule from './abi.json' assert { type: 'json' };
import ChessApiClient from './api.js';

const abi = abiModule.default;
const contractAddress = '0x207D7Ad5e15567ccA81a5E308FbA0c4AF6fA4Ea4';
const chessApi = new ChessApiClient();



async function main() {
    const client = createPublicClient({
        chain: sepolia,
        transport: http('https://eth-sepolia.g.alchemy.com/v2/JfkCeSqLY74hGpZ28pXMa7sQg7aINFE1')
    });

    const eventSignature = keccak256(toHex('GameStarted(address,address)'));
    console.log('Expected event signature:', eventSignature);

    const pastEvents = await client.getContractEvents({
        address: contractAddress,
        abi: abi,
        eventName: 'GameStarted',
        fromBlock: 'earliest'
    });
    console.log('Past GameStarted events:', pastEvents);

    try {
        const cleanup = await watchChessEvents(client, eventSignature);
        process.on('SIGINT', () => {
            console.log('Cleaning up...');
            cleanup();
            process.exit(0);
        });
    } catch (error) {
        console.error('Error watching events:', error);
    }
}

async function watchChessEvents(client, eventSignature) {
    console.log('Starting to watch chess events...');

    const unWatchGameStarted = await client.watchContractEvent({
        address: contractAddress,
        abi: abi,
        eventName: 'GameStarted',
        onLogs: async (logs) => {
            for (const log of logs) {
                const { whitePlayer, blackPlayer } = log.args;
                console.log('Event signature:', log.topics[0]);
                console.log('White player:', whitePlayer);
                console.log('Black player:', blackPlayer);
                if (log.topics[0] === eventSignature) {
                    console.log('Signature matches!');
                }
                try {
                    const chessApi = new ChessApiClient();
                    const response = await chessApi.startNewGame();
                    console.log('New game started successfully:', response);
                } catch (error) {
                    console.error('Failed to start new game:', error);
                }
            }
        }
    });
    

    const unWatchMoveMade = await client.watchContractEvent({
        address: contractAddress,
        abi: abi,
        eventName: 'MoveMade',
        onLogs: async (logs) => {
            for (const log of logs) {
                const { player, move } = log.args;
                console.log('Move made!');
                console.log(`Player: ${player}`);
                console.log(`Move: from (${move.fromX},${move.fromY}) to (${move.toX},${move.toY})`);

                try {
                    const response = await chessApi.makeMove(move.fromX, move.fromY, move.toX, move.toY);
                    console.log('Move sent to API successfully:', response);
                } catch (error) {
                    console.error('Failed to send move to API:', error);
                }
            }
        }
    });

    const unWatchGameWon = await client.watchContractEvent({
        address: contractAddress,
        abi: abi,
        eventName: 'GameWon',
        onLogs: (logs) => {
            logs.forEach(log => {
                const { winner, winningColor } = log.args;
                console.log('Game won!');
                console.log(`Winner: ${winner}`);
                console.log(`Winning Color: ${winningColor === 1 ? 'WHITE' : 'BLACK'}`);
            });
        }
    });

    return () => {
        unWatchGameStarted();
        unWatchMoveMade();
        unWatchGameWon();
        console.log('Stopped watching events');
    };
}

main().catch(console.error);