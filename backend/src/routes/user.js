// src/routes/user.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import User from '../models/user.js';

const router = express.Router();

// GET /user/me
router.get('/me', verifyToken, async (req, res) => {
  // verifyToken has already checked JWT and set req.user
  const user = await User.findById(req.user.id);

  res.json({
    user: {
      id: user._id,
      username: user.username,
      createdAt: user.createdAt,
    },
  });
});

export default router;
