const express = require('express');
const dotenv = require('dotenv');
const logger = require('./src/config/logger');
const routes = require('./src/routes');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
      const duration = Date.now() - start;
      logger.request(req.method, req.path, res.statusCode, duration);
  });
  next();
});

// Routes
app.use('/api', routes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
