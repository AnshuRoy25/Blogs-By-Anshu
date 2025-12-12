// src/seedBlogs.js
import './config/config.js';
import mongoose from 'mongoose';
import Blog from './models/blog.js';
import connectDB from './utils/db.js';

async function seedBlogs() {
  try {
    await connectDB();

    // Clear existing blogs (optional)
    await Blog.deleteMany({});

    const now = new Date();

    const blogs = [
      {
        title: 'Sample Published Blog',
        description: 'This is a short description for a published blog.',
        body: 'This is the full content of the published blog.',
        coverImageURL: 'https://via.placeholder.com/800x400?text=Published+Blog',
        isPublished: true,
        publishedAt: now,
      },
      {
        title: 'Sample Draft Blog',
        description: 'This is a short description for a draft blog.',
        body: 'This is the full content of the draft blog.',
        coverImageURL: 'https://via.placeholder.com/800x400?text=Draft+Blog',
        isPublished: false,
        publishedAt: null,
      },
    ];

    const created = await Blog.insertMany(blogs);
    console.log(`Inserted ${created.length} blogs`);
  } catch (err) {
    console.error('Seeding blogs failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedBlogs();
