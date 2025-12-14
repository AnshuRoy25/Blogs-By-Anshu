// src/routes/blogs.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Blog from '../models/blog.js';

const router = express.Router();

// GET /blogs → All published blogs with optional search (PUBLIC)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;  // Keep only search
    
    let query = { isPublished: true };

    if (search) {
      query = {
        isPublished: true,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 });

    res.json({ blogs });  // Simple response
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// GET /blogs/:id → Single blog (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog || !blog.isPublished) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ blog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /blogs/:id/like → Like blog (USERS ONLY)
router.put('/:id/like', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ blog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
