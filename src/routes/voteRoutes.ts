import express from 'express';
import { voteOnItem } from '../controllers/voteController';
import { protect } from '../middleware/authMiddleware';
const router = express.Router();

router.post('/',protect,voteOnItem);

export default router;