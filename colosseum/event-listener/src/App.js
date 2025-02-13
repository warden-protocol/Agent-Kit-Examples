import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

// Import your contract ABI
import abi from './abi.json';

const CONTRACT_ADDRESS = '0xe1b1b50528a7acc01bea0c0c6533ed5cb978672f';

function App() {
  const [game, setGame] = useState(new Chess());
  const [whitePlayer, setWhitePlayer] = useState(null);
  const [blackPlayer, setBlackPlayer] = useState(null);
  const [gameStatus, setGameStatus] = useState('Waiting for players...');

  useEffect(() => {
    setupEventListeners();
  }, []);

  const setupEventListeners = async () => {
    const client = createPublicClient({
      chain: sepolia,
      transport: http('https://eth-sepolia.g.alchemy.com/v2/JfkCeSqLY74hGpZ28pXMa7sQg7aINFE1')
    });

    // Watch GameStarted events
    client.watchContractEvent({
      address: CONTRACT_ADDRESS,
      abi: abi,
      eventName: 'GameStarted',
      onLogs: (logs) => {
        logs.forEach(log => {
          const { whitePlayer: white, blackPlayer: black } = log.args;
          setWhitePlayer(white);
          setBlackPlayer(black);
          setGameStatus('Game Started!');
          console.log(`White Player: ${white}`);
          console.log(`Black Player: ${black}`);
        });
      }
    });

    // Watch MoveMade events
    client.watchContractEvent({
      address: CONTRACT_ADDRESS,
      abi: abi,
      eventName: 'MoveMade',
      onLogs: (logs) => {
        logs.forEach(log => {
          const { player, move } = log.args;
          handleMove(player, move);
        });
      }
    });

    // Watch GameWon events
    client.watchContractEvent({
      address: CONTRACT_ADDRESS,
      abi: abi,
      eventName: 'GameWon',
      onLogs: (logs) => {
        logs.forEach(log => {
          const { winner, winningColor } = log.args;
          setGameStatus(`Game Over! Winner: ${winner} (${winningColor === 1 ? 'WHITE' : 'BLACK'})`);
        });
      }
    });
  };

  const handleMove = (player, move) => {
    const { fromX, fromY, toX, toY } = move;
    
    // Convert contract coordinates (0-7) to chess notation
    const fromSquare = coordinatesToSquare(fromX, fromY);
    const toSquare = coordinatesToSquare(toX, toY);

    // Make the move in the chess.js instance
    try {
      const newGame = new Chess(game.fen());
      newGame.move({
        from: fromSquare,
        to: toSquare,
        promotion: 'q' // Always promote to queen for simplicity
      });
      setGame(newGame);
      
      // Update game status
      const playerColor = player === whitePlayer ? 'White' : 'Black';
      setGameStatus(`Last move by ${playerColor}: ${fromSquare} to ${toSquare}`);
    } catch (error) {
      console.error('Invalid move:', error);
    }
  };

  // Helper function to convert coordinates to chess notation
  const coordinatesToSquare = (x, y) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    return files[x] + ranks[y];
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Chess Game</h1>
      <div style={{ marginBottom: '20px' }}>
        <p>Status: {gameStatus}</p>
        {whitePlayer && <p>White Player: {whitePlayer}</p>}
        {blackPlayer && <p>Black Player: {blackPlayer}</p>}
      </div>
      <Chessboard 
        position={game.fen()} 
        boardWidth={600}
        areArrowsAllowed={true}
        showBoardNotation={true}
      />
    </div>
  );
}

export default App; 