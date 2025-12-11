import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,  // Must have content
  },
  updatedAt: {
    type: Date,
    default: Date.now,  // Auto-track when it was last updated
  },
});

export default mongoose.model('About', aboutSchema);
