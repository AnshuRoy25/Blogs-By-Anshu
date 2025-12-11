import express from 'express';
import About from '../models/about.js';

const router = express.Router();

// GET /about - Public route
router.get('/', async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) return res.status(404).json({ error: 'About content not found' });
    res.json({ about });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
