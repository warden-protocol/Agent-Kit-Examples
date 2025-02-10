import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ChessBoard() {
  const [game, setGame] = useState(new Chess());
  const [errorMsg, setErrorMsg] = useState('');

  const convertCoordinates = (fromX, fromY, toX, toY) => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

    // Convert array indices to chess notation
    const fromSquare = files[fromX] + ranks[7 - fromY]; // Flip the rank for correct orientation
    const toSquare = files[toX] + ranks[7 - toY];

    return { fromSquare, toSquare };
  };

  const makeMove = (moveData) => {
    try {
      const { fromX, fromY, toX, toY } = moveData;
      console.log('Making move:', { fromX, fromY, toX, toY });

      // Use the current game state and modify it directly
      const { fromSquare, toSquare } = convertCoordinates(fromX, fromY, toX, toY);
      const piece = game.get(fromSquare);

      if (piece) {
        // Update the game state by reference to preserve history
        game.remove(fromSquare);
        game.put({ type: piece.type, color: piece.color }, toSquare);
        game.load(game.fen().replace(/ [wb] /, game.turn() === 'w' ? ' b ' : ' w '));

        // Trigger a re-render by creating a new reference
        setGame(new Chess(game.fen()));
      }

      setErrorMsg('');
    } catch (error) {
      console.error('Error making move:', error);
      setErrorMsg('Error processing move');
    }
  };

  const handleWebSocketMessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      // Handle reset message
      if (data.type === 'reset') {
        console.log('Resetting game to initial position');
        setGame(new Chess()); // Creates a new game with default position
        setErrorMsg('');
        return;
      }

      // Handle move message
      console.log('Received move data:', data);
      makeMove(data);
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  };

  useEffect(() => {
    // Connect to WebSocket with specific path
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws/chess`);

    ws.onopen = () => {
      console.log('Connected to chess WebSocket');
      setErrorMsg('');
    };

    ws.onmessage = handleWebSocketMessage;

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setErrorMsg('Connection error');
    };

    ws.onclose = () => {
      console.log('Chess WebSocket connection closed');
      setErrorMsg('Connection lost. Moves will not be received.');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <div>
      {errorMsg && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      <div className="aspect-square max-w-[600px] mx-auto">
        <Chessboard 
          position={game.fen()} 
          boardWidth={600}
          areArrowsAllowed={true}
          showBoardNotation={true}
        />
      </div>
    </div>
  );
}