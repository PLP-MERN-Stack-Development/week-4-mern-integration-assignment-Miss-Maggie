const Comment = require('../models/Comment');

exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { author, content } = req.body;
    if (!author || !content) return res.status(400).json({ error: 'All fields required' });
    const comment = await Comment.create({
      post: req.params.postId,
      author,
      content
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 