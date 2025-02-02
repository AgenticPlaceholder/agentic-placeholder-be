import express from 'express';
import { getOperatorDetails } from './operator.controller';

const router = express.Router();

router.get('/', getOperatorDetails);

export default router;