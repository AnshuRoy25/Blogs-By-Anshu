// src/models/Blog.js
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      minlength: 5,
      maxlength: 200,
    },

    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: 500,
    },

    body: {
      type: String,
      required: [true, 'Please provide blog content'],
      minlength: 10,
    },

    coverImageURL: {
      type: String,
      required: false,
    },

    likes: {
      type: Number,
      default: 0,
      min: 0,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
