import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import logger from './src/config/logger';
// Import routes without default
import { router as routes } from './src/routes';
import { connectDB } from './src/config/database';
import { WebSocketService } from './src/modules/websocket/websocket.service';
import { EventService } from './src/modules/events/events.service';
import { taskWatcherService } from './src/modules/events/avs-task-watcher';
import { createServer as createHttpsServer } from 'https';
import { createServer as createHttpServer } from 'http';
import cors from 'cors';
import * as fs from 'fs';


// Load environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;
const isDevelopment = process.env.NODE_ENV !== 'production';

// Create appropriate server based on environment
let server;
if (isDevelopment) {
  // Use HTTP for local development
  server = createHttpServer(app);
  console.log('Running in development mode with HTTP');
} else {
  // Use HTTPS for production
  const options = {
    key: fs.readFileSync('./certs/privkey.pem'),
    cert: fs.readFileSync('./certs/fullchain.pem')
  };
  server = createHttpsServer(options, app);
  console.log('Running in production mode with HTTPS');
}

// Initialize WebSocket Service with the HTTP server
const wsService = new WebSocketService(server);
const eventService = new EventService(wsService);
// Start listening for events
const startEventService = async () => {
  await eventService.start();
};
startEventService();
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
    await connectDB();
    try {
      await taskWatcherService.startWatching();
      logger.info('Task watcher service started successfully');
    } catch (error) {
      logger.error('Failed to start task watcher service:', error);
    }
    
    const serverPort = isDevelopment ? PORT : 443;
    server.listen(serverPort, () => {
      logger.info(`Server running on port ${serverPort} in ${process.env.NODE_ENV || 'development'} mode`);
      if (isDevelopment) {
        logger.info(`WebSocket server running on ws://localhost:${serverPort}`);
      } else {
        logger.info(`WSS server running on wss://placeholder.taraxio.com`);
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Export both the app and WebSocket service
export { app, wsService };