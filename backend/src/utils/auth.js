// src/utils/auth.js
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export function createTokenForUser(user) {
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role,  // Add role to JWT
  };

  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });

  return token;
}

