import express from 'express';
import { getDashboardDetails } from './publisher.controller';

const router = express.Router();

router.get('/dashboard', getDashboardDetails);


export default router;