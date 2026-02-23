import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { createComment } from '../controllers/commentController';

const router = express.Router();
router.post('/',protect,createComment);
export default router;
