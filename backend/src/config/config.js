import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 8080,
  mongoURI: process.env.MONGODB_URI,
  env: process.env.NODE_ENV || 'development',
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
  confession_expiry: 60000,  // example custom config (milliseconds)
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
};

export default config;
