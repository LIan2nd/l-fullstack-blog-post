import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

/**
 * @desc    Create comment on a post
 * @route   POST /api/posts/:postId/comments
 * @access  Private
 */
const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      post: postId,
    });

    const populatedComment = await comment.populate('author', 'name username profilePic');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Create comment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete comment
 * @route   DELETE /api/comments/:id
 * @access  Private (Author only)
 */
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check authorization - only author can delete
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.deleteOne({ _id: req.params.id });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export { createComment, deleteComment };
