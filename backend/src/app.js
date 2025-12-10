// src/app.js
import express from 'express';
import cors from 'cors';
import config from './config/config.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import commentRoutes from './routes/comments.js';
import blogRoutes from './routes/blogs.js';

const app = express();

app.use(cors({ origin: config.frontend_url, credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes); // /auth/register, /auth/login
app.use('/user', userRoutes); // /user/me (protected)
app.use('/comments', commentRoutes);
app.use('/blogs', blogRoutes);

export default app;
