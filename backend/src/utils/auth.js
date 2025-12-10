// src/utils/auth.js
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export function createTokenForUser(user) {
  const payload = {
    userId: user._id,
    username: user.username,
  };

  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpire, // e.g. '7d'
  });

  return token;
}
