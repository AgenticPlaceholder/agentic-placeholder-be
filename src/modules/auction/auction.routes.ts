import express from 'express';
import { startAuction, bid, endAuctionNoBids } from './auction.controller';

const router = express.Router();

router.post('/start', startAuction);
router.post('/bid', bid);
router.post('/endAuctionNoBids', endAuctionNoBids);

export default router;