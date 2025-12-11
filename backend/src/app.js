// src/app.js
import express from 'express';
import cors from 'cors';
import config from './config/config.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import commentRoutes from './routes/comment.js';
import blogRoutes from './routes/blog.js';
import adminRoutes from './routes/admin.js';
import aboutRoutes from './routes/about.js';

const app = express();

app.use(cors({ origin: config.frontend_url, credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes); // /auth/register, /auth/login
app.use('/user', userRoutes); // /user/me (protected)
app.use('/comments', commentRoutes);
app.use('/blogs', blogRoutes);
app.use('/admin', adminRoutes); 
app.use('/about', aboutRoutes);   

export default app;
