import { createPublicClient, http, type Log } from 'node_modules/viem';
import { sepolia } from 'viem/chains';

const contractAddress = '0xbf178ba1bfce96d4de31c4df18e05f0ae0192be8';
const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "whitePlayer",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "blackPlayer",
        "type": "address"
      }
    ],
    "name": "GameStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "fromX",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "fromY",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "toX",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "toY",
            "type": "uint8"
          }
        ],
        "indexed": false,
        "internalType": "struct ChessGame.Move",
        "name": "move",
        "type": "tuple"
      }
    ],
    "name": "MoveMade",
    "type": "event"
  }
];

class ChessEventManager {
  client;
  listeners = new Set();

  constructor() {
    this.client = createPublicClient({
      chain: sepolia,
      transport: http('https://eth-sepolia.g.alchemy.com/v2/JfkCeSqLY74hGpZ28pXMa7sQg7aINFE1')
    });
  }

  async subscribe(callback) {
    this.listeners.add(callback);

    if (this.listeners.size === 1) {
      const unwatch = await this.client.watchContractEvent({
        address: contractAddress,
        abi: abi,
        eventName: 'MoveMade',
        onLogs: (logs) => {
          logs.forEach(log => {
            if (!log.args) return;
            const { player, move } = log.args;
            if (!move) return;

            this.listeners.forEach(listener => {
              if (typeof listener === 'function') {
                listener({
                  player,
                  from: [Number(move.fromX), Number(move.fromY)],
                  to: [Number(move.toX), Number(move.toY)]
                });
              }
            });
          });
        }
      });

      return () => {
        this.listeners.delete(callback);
        if (this.listeners.size === 0) {
          unwatch();
        }
      };
    }

    return () => this.listeners.delete(callback);
  }

  async getPastMoves() {
    const events = await this.client.getContractEvents({
      address: contractAddress,
      abi: abi,
      eventName: 'MoveMade',
      fromBlock: 'earliest'
    });

    return events
      .filter(event => event.args && event.args.move)
      .map(event => {
        const { player, move } = event.args;
        return {
          player,
          from: [Number(move.fromX), Number(move.fromY)],
          to: [Number(move.toX), Number(move.toY)]
        };
      });
  }
}

export const chessEvents = new ChessEventManager();