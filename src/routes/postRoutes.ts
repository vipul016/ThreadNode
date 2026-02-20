import express from 'express';
import { createPost } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/',protect,createPost);

export default router;