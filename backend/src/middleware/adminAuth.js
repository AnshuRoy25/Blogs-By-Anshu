// src/middlewares/adminAuth.js
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export function verifyAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = { id: payload.userId, username: payload.username, role: payload.role };
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
}
