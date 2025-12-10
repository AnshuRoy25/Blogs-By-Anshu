// src/routes/auth.js
import express from 'express';
import User from '../models/user.js';
import { createTokenForUser } from '../utils/auth.js';

const router = express.Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1) Create user (bcrypt hashes in pre-save hook)
    const user = await User.create({
      username,
      passwordHash: password,  // plain here, will be hashed by model
    });

    // 2) Create JWT for this new user
    const token = createTokenForUser(user);

    // 3) Send token + basic user info to frontend
    res.status(201).json({
      message: 'Registered & logged in',
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1) Find user by username and also get hashed password
    const user = await User.findOne({ username }).select('+passwordHash');
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // 2) Compare plain password with stored hash (bcrypt.compare)
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // 3) Create JWT if password is correct
    const token = createTokenForUser(user);

    // 4) Send token to frontend
    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
