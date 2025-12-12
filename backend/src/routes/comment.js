// src/routes/comments.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Comment from '../models/comment.js';

const router = express.Router();


// POST /comments  → add a new TOP-LEVEL comment (USERS ONLY)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, blogId } = req.body;

    if (!content || !blogId) {
      return res.status(400).json({ error: 'content and blogId are required' });
    }

    const comment = await Comment.create({
      content,
      blogId,
      userId: req.user.id,   // logged-in user
      parentCommentId: null, // top-level
      isAdminReply: false,
    });

    res.status(201).json({ comment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// src/routes/comment.js

// GET /comments/:blogId  → all top-level comments + admin replies (PUBLIC)
router.get('/:blogId', async (req, res) => {
  try {
    // 1) Fetch top-level comments for this blog
    const comments = await Comment.find({
      blogId: req.params.blogId,
      parentCommentId: null,
    })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    // 2) For each top-level comment, fetch its replies
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentCommentId: comment._id,
        })
          .populate('userId', 'username')
          .sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies,
        };
      })
    );

    res.json({ comments: commentsWithReplies });
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
