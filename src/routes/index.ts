// src/routes/index.js
import express from 'express';
const router = express.Router();
import userRoutes from '../modules/user/user.routes';
import operatorRoutes from '../modules/operator/operator.routes';
import publisherRoutes from '../modules/publisher/publisher.routes';

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
router.use('/operator', operatorRoutes);
router.use('/publisher', publisherRoutes);
export { router };