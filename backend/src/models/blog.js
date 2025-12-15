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
      required: [true, 'Please provide a description'],  // Must be provided
      trim: true,
      minlength: 5,      // At least 5 chars
      maxlength: 500,    // At most 500 chars
    },


    body: {
      type: String,
      required: [true, 'Please provide blog content'],
      minlength: 10,
    },

    coverImageURL: {
      type: String,
      required: [true, 'Please provide a cover image URL'],
      match: [
        /^https?:\/\/.+/,
        'Please provide a valid URL starting with http:// or https://'
      ],
    },

    likes: {
      type: Number,
      default: 0,
      min: 0,
    },

    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    publishedAt: {
      type: Date,
      default: null,
    },

    isPublished: {
      type: Boolean,
      default: false,   // better default for your draft/publish flow
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
