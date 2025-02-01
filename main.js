const express = require('express');
const dotenv = require('dotenv');
const routes = require('./src/routes');


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
