// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract OnChessGame {
    enum PieceType { EMPTY, PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING }
    enum Color { NONE, WHITE, BLACK }

    struct Piece {
        PieceType pieceType;
        Color color;
        bool hasMoved;
    }

    struct Move {
        uint8 fromX;
        uint8 fromY;
        uint8 toX;
        uint8 toY;
    }

    Piece[8][8] public board;
    Color public currentTurn;
    address public whitePlayer;
    address public blackPlayer;
    bool public gameStarted;
    bool public gameOver;

    event GameStarted(address whitePlayer, address blackPlayer);
    event MoveMade(address player, Move move);
    event GameWon(address winner, Color winningColor);

    constructor() {
        initializeBoard();
    }

    function initializeBoard() public {
        // Clear entire board
        for (uint8 y = 0; y < 8; y++) {
            for (uint8 x = 0; x < 8; x++) {
                board[y][x] = Piece(PieceType.EMPTY, Color.NONE, false);
            }
        }

        // Initialize pawns
        for (uint8 x = 0; x < 8; x++) {
            board[1][x] = Piece(PieceType.PAWN, Color.WHITE, false);
            board[6][x] = Piece(PieceType.PAWN, Color.BLACK, false);
        }

        // White pieces
        board[0][0] = Piece(PieceType.ROOK, Color.WHITE, false);
        board[0][1] = Piece(PieceType.KNIGHT, Color.WHITE, false);
        board[0][2] = Piece(PieceType.BISHOP, Color.WHITE, false);
        board[0][3] = Piece(PieceType.QUEEN, Color.WHITE, false);
        board[0][4] = Piece(PieceType.KING, Color.WHITE, false);
        board[0][5] = Piece(PieceType.BISHOP, Color.WHITE, false);
        board[0][6] = Piece(PieceType.KNIGHT, Color.WHITE, false);
        board[0][7] = Piece(PieceType.ROOK, Color.WHITE, false);

        // Black pieces
        board[7][0] = Piece(PieceType.ROOK, Color.BLACK, false);
        board[7][1] = Piece(PieceType.KNIGHT, Color.BLACK, false);
        board[7][2] = Piece(PieceType.BISHOP, Color.BLACK, false);
        board[7][3] = Piece(PieceType.QUEEN, Color.BLACK, false);
        board[7][4] = Piece(PieceType.KING, Color.BLACK, false);
        board[7][5] = Piece(PieceType.BISHOP, Color.BLACK, false);
        board[7][6] = Piece(PieceType.KNIGHT, Color.BLACK, false);
        board[7][7] = Piece(PieceType.ROOK, Color.BLACK, false);
    }

    function joinGame() external {
        require(!gameStarted, "Game already started");
        require(msg.sender != whitePlayer && msg.sender != blackPlayer, "Already joined");
        
        if (whitePlayer == address(0)) {
            whitePlayer = msg.sender;
        } else if (blackPlayer == address(0)) {
            blackPlayer = msg.sender;
            gameStarted = true;
            currentTurn = Color.WHITE;
            emit GameStarted(whitePlayer, blackPlayer);
        } else {
            revert("Game is full");
        }
    }

    function makeMove(Move memory move) external {
        require(gameStarted && !gameOver, "Game not active");
        require(msg.sender == (currentTurn == Color.WHITE ? whitePlayer : blackPlayer), "Not your turn");
        
        Piece memory movingPiece = board[move.fromY][move.fromX];
        require(movingPiece.color == currentTurn, "Invalid piece color");
        require(isValidMove(move, movingPiece), "Invalid move");

        // Execute move
        board[move.toY][move.toX] = movingPiece;
        delete board[move.fromY][move.fromX];
        movingPiece.hasMoved = true;

        checkGameState();
        currentTurn = (currentTurn == Color.WHITE) ? Color.BLACK : Color.WHITE;
        emit MoveMade(msg.sender, move);
    }

    function isValidMove(Move memory move, Piece memory piece) private view returns (bool) {
        if (move.toX >= 8 || move.toY >= 8 || move.fromX >= 8 || move.fromY >= 8) return false;
        
        Piece memory targetPiece = board[move.toY][move.toX];
        if (targetPiece.color == piece.color) return false;

        int8 dx = int8(move.toX) - int8(move.fromX);
        int8 dy = int8(move.toY) - int8(move.fromY);
        
        if (piece.pieceType == PieceType.PAWN) {
            return validatePawnMove(move, piece, dx, dy);
        } else if (piece.pieceType == PieceType.ROOK) {
            return validateRookMove(move, dx, dy);
        } else if (piece.pieceType == PieceType.KNIGHT) {
            return validateKnightMove(dx, dy);
        } else if (piece.pieceType == PieceType.BISHOP) {
            return validateBishopMove(move, dx, dy);
        } else if (piece.pieceType == PieceType.QUEEN) {
            return validateQueenMove(move, dx, dy);
        } else if (piece.pieceType == PieceType.KING) {
            return validateKingMove(dx, dy);
        }
        return false;
    }

    function validatePawnMove(Move memory move, Piece memory piece, int8 dx, int8 dy) private view returns (bool) {
        int8 direction = (piece.color == Color.WHITE) ? int8(1) : -1;
        
        // Forward movement
        if (dx == 0) {
            if (dy == direction) {
                return board[move.toY][move.toX].pieceType == PieceType.EMPTY;
            }
            if (!piece.hasMoved && dy == 2 * direction) {
                uint8 intermediateY = uint8(int8(move.fromY) + direction);
                return board[intermediateY][move.fromX].pieceType == PieceType.EMPTY && 
                       board[move.toY][move.toX].pieceType == PieceType.EMPTY;
            }
        }
        
        // Capture
        if (abs(dx) == 1 && dy == direction) {
            return board[move.toY][move.toX].color != piece.color && 
                   board[move.toY][move.toX].pieceType != PieceType.EMPTY;
        }
        return false;
    }

    function validateRookMove(Move memory move, int8 dx, int8 dy) private view returns (bool) {
        if (dx != 0 && dy != 0) return false;
        return checkClearPath(move.fromX, move.fromY, move.toX, move.toY);
    }

    function validateBishopMove(Move memory move, int8 dx, int8 dy) private view returns (bool) {
        if (abs(dx) != abs(dy)) return false;
        return checkClearPath(move.fromX, move.fromY, move.toX, move.toY);
    }

    function validateQueenMove(Move memory move, int8 dx, int8 dy) private view returns (bool) {
        if (dx != 0 && dy != 0 && abs(dx) != abs(dy)) return false;
        return checkClearPath(move.fromX, move.fromY, move.toX, move.toY);
    }

    function validateKnightMove(int8 dx, int8 dy) private pure returns (bool) {
        return (abs(dx) == 2 && abs(dy) == 1) || (abs(dx) == 1 && abs(dy) == 2);
    }

    function validateKingMove(int8 dx, int8 dy) private pure returns (bool) {
        return abs(dx) <= 1 && abs(dy) <= 1;
    }

    function checkClearPath(uint8 fromX, uint8 fromY, uint8 toX, uint8 toY) private view returns (bool) {
        int8 dx = toX > fromX ? int8(1) : (toX < fromX ? int8(-1) : int8(0));
        int8 dy = toY > fromY ? int8(1) : (toY < fromY ? int8(-1) : int8(0));
        
        uint8 x = fromX;
        uint8 y = fromY;
        uint8 diffX = toX > fromX ? toX - fromX : fromX - toX;
        uint8 diffY = toY > fromY ? toY - fromY : fromY - toY;
        uint8 steps = diffX > diffY ? diffX : diffY;
        for (uint8 i = 1; i < steps; i++) {
            x = uint8(int8(x) + dx);
            y = uint8(int8(y) + dy);
            
            if (x >= 8 || y >= 8) return false;
            if (board[y][x].pieceType != PieceType.EMPTY) return false;
        }
        return true;
    }

    function max(int8 a, int8 b) private pure returns (int8) {
        return a > b ? a : b;
    }

    function abs(int8 x) private pure returns (uint8) {
        return x >= 0 ? uint8(x) : uint8(-x);
    }
    function hasAnyValidMove(Color color) private view returns (bool) {
        for (uint8 fromY = 0; fromY < 8; fromY++) {
            for (uint8 fromX = 0; fromX < 8; fromX++) {
                Piece memory piece = board[fromY][fromX];
                
                // Skip if not a piece of the current color
                if (piece.color != color || piece.pieceType == PieceType(0)) continue;
    
                // Try all possible moves for this piece
                for (uint8 toY = 0; toY < 8; toY++) {
                    for (uint8 toX = 0; toX < 8; toX++) {
                        Move memory testMove = Move(fromX, fromY, toX, toY);
                        
                        // If this move is valid, return true
                        if (isValidMove(testMove, piece)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
   function checkGameState() private {
        Color currentColor = currentTurn;
        Color opponentColor = (currentColor == Color.WHITE) ? Color.BLACK : Color.WHITE;
    
        // Find the king's position
        uint8 kingX;
        uint8 kingY;
        bool kingFound = false;
        for (uint8 y = 0; y < 8; y++) {
            for (uint8 x = 0; x < 8; x++) {
                if (board[y][x].pieceType == PieceType.KING && board[y][x].color == currentColor) {
                    kingX = x;
                    kingY = y;
                    kingFound = true;
                    break;
                }
            }
            if (kingFound) break;
        }
    
        // Check if king is in check
        bool inCheck = isSquareUnderAttack(kingX, kingY, opponentColor);
    
        // Check if any move can get the king out of check
        if (inCheck) {
            if (!canEscapeCheck(currentColor, kingX, kingY)) {
                // Checkmate
                gameOver = true;
                address winner = (currentColor == Color.WHITE) ? blackPlayer : whitePlayer;
                emit GameWon(winner, opponentColor);
                return;
            }
        } else {
            // Check for stalemate
            if (!hasAnyValidMove(currentColor)) {
                gameOver = true;
                // Stalemate is a draw
                emit GameWon(address(0), Color.WHITE); // Indicates a draw
                return;
            }
        }
    }
    function isSquareUnderAttack(uint8 x, uint8 y, Color attackerColor) private view returns (bool) {
        for (uint8 fromY = 0; fromY < 8; fromY++) {
            for (uint8 fromX = 0; fromX < 8; fromX++) {
                Piece memory attacker = board[fromY][fromX];
                
                // Skip if not an attacker piece
                if (attacker.color != attackerColor || attacker.pieceType == PieceType(0)) continue;
    
                Move memory testMove = Move(fromX, fromY, x, y);
                
                // Check if this piece can theoretically move to the target square
                if (isValidMove(testMove, attacker)) {
                    return true;
                }
            }
        }
        return false;
    }

    function canEscapeCheck(Color color, uint8 kingX, uint8 kingY) private returns (bool) {
        for (uint8 fromY = 0; fromY < 8; fromY++) {
            for (uint8 fromX = 0; fromX < 8; fromX++) {
                Piece memory piece = board[fromY][fromX];
                
                // Skip if not a piece of the current color
                if (piece.color != color || piece.pieceType == PieceType(0)) continue;
    
                // Try all possible moves for this piece
                for (uint8 toY = 0; toY < 8; toY++) {
                    for (uint8 toX = 0; toX < 8; toX++) {
                        Move memory testMove = Move(fromX, fromY, toX, toY);
                        
                        // If this move is valid, simulate it
                        if (isValidMove(testMove, piece)) {
                            // Temporarily apply the move
                            Piece memory originalTarget = board[toY][toX];
                            board[toY][toX] = piece;
                            delete board[fromY][fromX];
    
                            // Check if king is still in check after this move
                            bool stillInCheck = isSquareUnderAttack(kingX, kingY, 
                                (color == Color.WHITE) ? Color.BLACK : Color.WHITE);
    
                            // Restore the board
                            board[fromY][fromX] = piece;
                            board[toY][toX] = originalTarget;
    
                            // If move removes check, return true
                            if (!stillInCheck) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }


    function resignGame() external {
        require(gameStarted && !gameOver, "Invalid game state");
        require(msg.sender == whitePlayer || msg.sender == blackPlayer, "Not a player");

        gameOver = true;
        gameStarted= false;
        Color losingColor = (msg.sender == whitePlayer) ? Color.WHITE : Color.BLACK;
        address winner = (losingColor == Color.WHITE) ? blackPlayer : whitePlayer;

        emit GameWon(winner, losingColor == Color.WHITE ? Color.BLACK : Color.WHITE);
    }
}