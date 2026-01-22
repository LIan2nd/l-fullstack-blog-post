import express from 'express';
import {
  getProfile,
  updateProfile,
  getUserById,
  getUserPosts,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profilePic'), updateProfile);

// Public routes
router.get('/:id', getUserById);
router.get('/:id/posts', getUserPosts);

export default router;
