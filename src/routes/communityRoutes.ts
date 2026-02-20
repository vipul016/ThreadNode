import express from 'express';
import { createCommunity } from '../controllers/communityController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/',protect,createCommunity);

export default router;