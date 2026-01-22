import express from 'express';
import { createComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create comment on a post (nested route)
router.post('/posts/:postId/comments', protect, createComment);

// Delete comment
router.delete('/comments/:id', protect, deleteComment);

export default router;
