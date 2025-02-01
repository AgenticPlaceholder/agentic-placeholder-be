// src/routes/index.js
import express from 'express';
const router = express.Router();
import userRoutes from '../modules/user/user.routes';

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date()
    });
});

// Module routes
router.use('/user', userRoutes);
export { router };