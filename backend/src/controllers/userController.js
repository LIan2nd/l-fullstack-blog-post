import User from '../models/User.js';
import Post from '../models/Post.js';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Get current user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update user profile (name and/or profile picture)
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');

      const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

      user.profilePic = dataURI;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get user by ID (public profile)
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get posts by user ID
 * @route   GET /api/users/:id/posts
 * @access  Public
 */
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'name username profilePic')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Get user posts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getProfile, updateProfile, getUserById, getUserPosts };
