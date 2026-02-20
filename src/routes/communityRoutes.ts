import express from 'express';
import { createCommunity, getAllCommunties } from '../controllers/communityController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/',protect,createCommunity);
router.get('/',protect,getAllCommunties);

export default router;