const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: String, required: true }, // For demo: just a name or email
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema); 