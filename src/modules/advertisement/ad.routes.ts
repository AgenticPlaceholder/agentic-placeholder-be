import express from 'express';
import { publishAd } from './ad.controller';


const router = express.Router();

router.post('/publishAd', publishAd);


export default router;