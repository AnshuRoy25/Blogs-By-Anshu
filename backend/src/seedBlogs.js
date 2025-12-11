// src/seedBlogs.js
import './config/config.js';
import connectDB from './utils/db.js';
import Blog from './models/blog.js';

async function seed() {
  try {
    await connectDB();

    const blogs = [
      {
        title: 'My first test blog',
        description: 'Short description of the first blog',
        body: 'This is the full content of the first blog.',
        coverImageURL: 'https://via.placeholder.com/800x400?text=First+Blog',
        likes: 0,
        isPublished: true,
      },
      {
        title: 'Second sample blog',
        description: 'Another test blog entry',
        body: 'This is the content of the second blog post.',
        coverImageURL: 'https://via.placeholder.com/800x400?text=Second+Blog',
        likes: 3,
        isPublished: true,
      },
    ];

    const created = await Blog.insertMany(blogs);
    console.log(`Inserted ${created.length} blogs`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    process.exit(0);
  }
}

seed();
