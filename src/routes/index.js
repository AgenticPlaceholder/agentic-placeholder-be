// src/routes/index.js
const express = require('express');
const router = express.Router();
// const module1Routes = require('../modules/module1/module1.routes');


// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date()
    });
});

// Module routes
// router.use('/module1', module1Routes);


module.exports = router;