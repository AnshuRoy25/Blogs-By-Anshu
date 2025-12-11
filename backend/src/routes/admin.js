// src/routes/admin.js
import express from 'express';
import { verifyAdmin } from '../middleware/adminAuth.js';
import Blog from '../models/blog.js';
import Comment from '../models/comment.js';
import About from '../models/about.js';

const router = express.Router();

// POST /admin/blogs - Create blog (ADMIN ONLY)
router.post('/blogs', verifyAdmin, async (req, res) => {
  try {
    const { title, description, body, coverImageURL } = req.body;

    if (!title || !body || !coverImageURL) {
      return res.status(400).json({ error: 'title, body, and coverImageURL are required' });
    }

    const blog = await Blog.create({
      title,
      description,
      body,
      coverImageURL,
      userId: req.user.id,  // Track which admin created it
      isPublished: true,
    });

    res.status(201).json({ blog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// PUT /admin/blogs/:id - Edit blog (ADMIN ONLY)
router.put('/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, description, body, coverImageURL, isPublished } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description, body, coverImageURL, isPublished },
      { new: true }
    );

    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    res.json({ blog });
  } catch (err) {
    res.status(400).json({ error: err.message });
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



export default router;
