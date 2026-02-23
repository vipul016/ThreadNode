import express from 'express';
import { createCommunity, getAllCommunties, getCommunityById } from '../controllers/communityController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/',protect,createCommunity);
router.get('/',getAllCommunties);
router.get('/:id',protect,getCommunityById);

export default router;