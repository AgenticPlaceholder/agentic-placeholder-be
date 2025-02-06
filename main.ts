import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import logger from './src/config/logger';
// Import routes without default
import { router as routes } from './src/routes';
import { connectDB } from './src/config/database';
import { WebSocketService } from './src/modules/websocket/websocket.service';
// import { EventService } from './src/modules/events/events.service';
import { createServer } from 'https';
import cors from 'cors';
import * as fs from 'fs';

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/placeholder.taraxio.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/placeholder.taraxio.com/fullchain.pem')
};

// Load environment variables
dotenv.config();

const app = express();
const httpsServer = createServer(options, app);
const PORT = process.env.PORT || 4000;
// Initialize WebSocket Service with the HTTP server
const wsService = new WebSocketService(httpsServer);
// let eventService : EventService;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Add logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.request(req.method, req.originalUrl, res.statusCode, duration);
  });
  next();
});

// Routes
app.use('/api', routes);

// Initialize server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    httpsServer.listen(443, () => {
      logger.info(`Secure server running on port ${PORT}`);
      logger.info(`WSS server running on wss://placeholder.taraxio.com`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Export both the app and WebSocket service
export { app, wsService };