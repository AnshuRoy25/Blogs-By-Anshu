// src/routes/admin.js
import express from 'express';
import { verifyAdmin } from '../middleware/adminAuth.js';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import About from '../models/about.js';

const router = express.Router();

// POST /admin/blogs - Create new blog (can be DRAFT or PUBLISHED)
router.post('/blogs', verifyAdmin, async (req, res) => {
  try {
    const { title, description, body, coverImageURL, isPublished } = req.body;

    if (!title || !body || !coverImageURL) {
      return res.status(400).json({
        error: 'title, body, and coverImageURL are required',
      });
    }

    // Decide publish time based on isPublished flag
    // - If isPublished === true  → set publishedAt to now
    // - If isPublished === false → keep publishedAt null (draft)
    const publishedAt = isPublished ? new Date() : null;

    const blog = await Blog.create({
      title,
      description,
      body,
      coverImageURL,
      isPublished: isPublished || false, // default to draft if not sent
      publishedAt,
    });

    return res.status(201).json({
      message: isPublished ? 'Blog published' : 'Draft saved',
      blog,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});



// PUT /admin/blogs/:id - Edit blog (draft or published)
router.put('/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, description, body, coverImageURL, isPublished } = req.body;

    // Find current blog to know previous state
    const currentBlog = await Blog.findById(req.params.id);
    if (!currentBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Decide new publishedAt based on transition
    let publishedAt = currentBlog.publishedAt;

    // draft -> published
    if (isPublished === true && currentBlog.isPublished === false) {
      publishedAt = new Date();
    }

    // published -> draft
    if (isPublished === false && currentBlog.isPublished === true) {
      publishedAt = null;
    }

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        body,
        coverImageURL,
        isPublished,
        publishedAt,
      },
      { new: true }
    );

    return res.json({
      message: 'Blog updated successfully',
      blog: updated,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});



// DELETE /admin/blogs/:id - Delete blog (ADMIN ONLY)
router.delete('/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /admin/comments/:id - Delete comment (ADMIN ONLY)
router.delete('/comments/:id', verifyAdmin, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /admin/about - Edit about content (ADMIN ONLY)
router.put('/about', verifyAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    let about = await About.findOne();

    if (!about) {
      about = await About.create({ content });
    } else {
      about.content = content;
      about.updatedAt = new Date();
      await about.save();
    }

    res.json({ about });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /admin/drafts - Get all DRAFT blogs (ADMIN ONLY)
router.get('/drafts', verifyAdmin, async (req, res) => {
  try {
    const drafts = await Blog.find({ isPublished: false })
      .sort({ updatedAt: -1 })
      .select('title description coverImageURL createdAt updatedAt');

    res.json({ drafts });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /admin/comments/:commentId/reply  → Admin reply to a user comment
router.post('/comments/:commentId/reply', verifyAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    // Find the parent comment
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ error: 'Parent comment not found' });
    }

    const reply = await Comment.create({
      content,
      blogId: parentComment.blogId,  // same blog as parent
      userId: req.user.id,          // admin id from verifyAdmin
      parentCommentId: commentId,   // link to parent
      isAdminReply: true,
    });

    res.status(201).json({ reply });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



export default router;
