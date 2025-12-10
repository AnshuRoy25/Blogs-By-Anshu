// src/routes/comments.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Comment from '../models/comment.js';

const router = express.Router();

// POST /comments  → add a new comment (USERS ONLY)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, blogId } = req.body;

    if (!content || !blogId) {
      return res.status(400).json({ error: 'content and blogId are required' });
    }

    const comment = await Comment.create({
      content,
      blogId,
      userId: req.user.id, // from JWT (logged-in user only)
    });

    res.status(201).json({ comment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /comments/:blogId  → all comments for a blog (PUBLIC)
router.get('/:blogId', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.blogId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    res.json({ comments });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /comments/:id/like  → like a comment (USERS ONLY)
router.put('/:id/like', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    res.json({ comment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
