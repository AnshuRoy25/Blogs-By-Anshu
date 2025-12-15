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
// NEW
// PUT /blogs/:id/like → toggle like on blog (USERS ONLY)
router.put('/:id/like', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.id;

    // 1) Try to LIKE: only if user is not already in likedBy
    let blog = await Blog.findOneAndUpdate(
      { _id: blogId, likedBy: { $ne: userId } },
      {
        $addToSet: { likedBy: userId },   // add userId once
        $inc: { likes: 1 },               // increase like count
      },
      { new: true }
    );

    // 2) If null, user had already liked → UNLIKE instead
    if (!blog) {
      blog = await Blog.findOneAndUpdate(
        { _id: blogId, likedBy: userId },
        {
          $pull: { likedBy: userId },     // remove userId
          $inc: { likes: -1 },            // decrease like count
        },
        { new: true }
      );
    }

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ blog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /likes/blogs/:id
router.get("/likes/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "likedBy",
      "username"
    );
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json({ users: blog.likedBy }); // [{ _id, username }]
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



export default router;
