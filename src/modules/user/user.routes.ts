import express from 'express';
import { attest } from './user.controller';  // Import specific functions

const router = express.Router();

router.post('/attest', attest);

export default router;