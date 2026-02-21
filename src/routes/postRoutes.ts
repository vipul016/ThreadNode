import express from 'express';
import { createPost,getAllPosts,getPostById,deletePost} from '../controllers/postController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/',protect,createPost);
router.get('/:id',getPostById);
router.get('/',getAllPosts);
router.delete('/:id', protect, deletePost);

export default router;