import express from 'express';
import { getOperatorDetails, getAdDetails } from './operator.controller';

const router = express.Router();

router.get('/', getOperatorDetails);
router.get('/fetchAd', getAdDetails);

export default router;