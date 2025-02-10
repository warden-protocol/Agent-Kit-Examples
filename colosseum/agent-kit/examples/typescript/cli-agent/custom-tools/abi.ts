export const wagmiAbi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "whitePlayer",
				"type": "address"
			},
			{
				"indexed": false,
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
				"indexed": false,
				"internalType": "address",
				"name": "winner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum OnChessGame.Color",
				"name": "winningColor",
				"type": "uint8"
			}
		],
		"name": "GameWon",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "joinGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
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
				"internalType": "struct OnChessGame.Move",
				"name": "move",
				"type": "tuple"
			}
		],
		"name": "makeMove",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
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
				"internalType": "struct OnChessGame.Move",
				"name": "move",
				"type": "tuple"
			}
		],
		"name": "MoveMade",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "resignGame",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "blackPlayer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "board",
		"outputs": [
			{
				"internalType": "enum OnChessGame.PieceType",
				"name": "pieceType",
				"type": "uint8"
			},
			{
				"internalType": "enum OnChessGame.Color",
				"name": "color",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "hasMoved",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "currentTurn",
		"outputs": [
			{
				"internalType": "enum OnChessGame.Color",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "gameOver",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "gameStarted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "whitePlayer",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] as const;