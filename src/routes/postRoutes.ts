import express from 'express';
import { createPost,getPostById } from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/',protect,createPost);
router.get('/:id',protect,getPostById);

export default router;