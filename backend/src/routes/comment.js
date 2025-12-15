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

    let comment = await Comment.create({
      content,
      blogId,
      userId: req.user.id,
      parentCommentId: null,
      isAdminReply: false,
    });

    comment = await comment.populate('userId', 'username');


    res.status(201).json({ comment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


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



// PUT /comments/:id/like → toggle like (USERS ONLY)
router.put('/:id/like', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const commentId = req.params.id;

    // 1) Try to LIKE: only if user is not already in likedBy
    let comment = await Comment.findOneAndUpdate(
      { _id: commentId, likedBy: { $ne: userId } },
      {
        $addToSet: { likedBy: userId },   // add userId once
        $inc: { likes: 1 },               // increase like count
      },
      { new: true }
    );

    // 2) If no doc matched above, user had already liked → UNLIKE instead
    if (!comment) {
      comment = await Comment.findOneAndUpdate(
        { _id: commentId, likedBy: userId },
        {
          $pull: { likedBy: userId },     // remove userId
          $inc: { likes: -1 },            // decrease like count
        },
        { new: true }
      );
    }

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // keep username available so UI doesn’t show Anonymous after like
    await comment.populate('userId', 'username');

    res.json({ comment });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /likes/comments/:id
router.get("/likes/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate(
      "likedBy",
      "username"
    );
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    res.json({ users: comment.likedBy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



export default router;
