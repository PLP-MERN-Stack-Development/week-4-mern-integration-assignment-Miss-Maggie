const mongoose = require('mongoose');

// Define the schema for a blog post
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Remove whitespace
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to Category model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set default to current date
  },
  featuredImage: {
    type: String, // Will store the file path or URL
  },
});

// Export the Post model
module.exports = mongoose.model('Post', postSchema); 