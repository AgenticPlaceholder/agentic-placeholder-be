import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import logger from './src/config/logger';
// Import routes without default
import { router as routes } from './src/routes';
import { connectDB } from './src/config/database';
import { WebSocketService } from './src/modules/websocket.service';
import { createServer } from 'http';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;
// Initialize WebSocket Service with the HTTP server
const wsService = new WebSocketService(httpServer);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    
    httpServer.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`WebSocket server is also running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Export both the app and WebSocket service
export { app, wsService };