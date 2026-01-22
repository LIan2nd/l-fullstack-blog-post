import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

/**
 * @desc    Get all posts with search and pagination
 * @route   GET /api/posts
 * @query   search - Filter by title or content (optional)
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 6)
 * @access  Public
 */
const getPosts = async (req, res) => {
  try {
    const { search, page = 1, limit = 6 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build search query using MongoDB Regex
    const query = search
      ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      }
      : {};

    // Get total count for pagination
    const total = await Post.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    // Fetch posts with pagination
    const posts = await Post.find(query)
      .populate('author', 'name username profilePic')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      posts,
      totalPages,
      currentPage: pageNum,
      totalPosts: total,
    });
  } catch (error) {
    console.error('Get posts error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name username profilePic');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Fetch comments for this post
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'name username profilePic')
      .sort({ createdAt: -1 });

    res.json({ post, comments });
  } catch (error) {
    console.error('Get post error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Create new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
    });

    const populatedPost = await post.populate('author', 'name username profilePic');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Create post error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 * @access  Private (Author only)
 */
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check authorization - only author can update
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;

    const updatedPost = await post.save();
    const populatedPost = await updatedPost.populate('author', 'name username profilePic');

    res.json(populatedPost);
  } catch (error) {
    console.error('Update post error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private (Author only)
 */
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check authorization - only author can delete
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete all comments for this post
    await Comment.deleteMany({ post: req.params.id });

    // Delete the post
    await Post.deleteOne({ _id: req.params.id });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getPosts, getPostById, createPost, updatePost, deletePost };
