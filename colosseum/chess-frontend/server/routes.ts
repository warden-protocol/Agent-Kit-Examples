import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocket, WebSocketServer } from 'ws';

let wsServer: WebSocketServer;

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Initialize WebSocket server with a specific path
  wsServer = new WebSocketServer({ 
    server: httpServer,
    path: '/ws/chess'  // Dedicated path for chess moves
  });

  wsServer.on('connection', (ws) => {
    console.log('Chess client connected');

    ws.on('error', console.error);

    ws.on('close', () => {
      console.log('Chess client disconnected');
    });
  });

  // API endpoint to make a move
  app.post('/api/move', (req, res) => {
    const { fromX, fromY, toX, toY, color } = req.body;

    // Validate the move parameters
    if (typeof fromX !== 'number' || typeof fromY !== 'number' || 
        typeof toX !== 'number' || typeof toY !== 'number' ||
        typeof color !== 'string') {
      return res.status(400).json({ error: 'Invalid move parameters' });
    }

    // Broadcast the move to all connected clients
    const moveData = { fromX, fromY, toX, toY, color };
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(moveData));
      }
    });

    res.json({ success: true });
  });

  // New endpoint to initialize a new game
  app.post('/api/game/new', (_req, res) => {
    // Broadcast game initialization to all connected clients
    const resetMessage = { type: 'reset' };
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(resetMessage));
      }
    });

    res.json({ success: true, message: 'New game initialized' });
  });

  return httpServer;
}