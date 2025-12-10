// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    // attach user info to req
    req.user = { id: payload.userId, username: payload.username };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
}
