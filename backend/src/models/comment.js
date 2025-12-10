// src/models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please provide comment content'],
      minlength: 1,
      maxlength: 5000,
      trim: true,
    },

    likes: {
      type: Number,
      default: 0,
      min: 0,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user'],
    },

    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'Comment must belong to a blog'],
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
