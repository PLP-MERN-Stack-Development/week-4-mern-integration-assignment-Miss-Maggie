const Post = require('../models/Post');

// Get all blog posts
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const searchQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const [posts, total] = await Promise.all([
      Post.find(searchQuery)
        .populate('category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(searchQuery)
    ]);

    res.json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single blog post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('category');
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new blog post
exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    // Create and save new post
    const newPost = new Post({ title, content, category });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an existing blog post
exports.updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    // Find post by ID and update
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true, runValidators: true }
    );
    if (!updatedPost) return res.status(404).json({ error: 'Post not found' });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a blog post
exports.deletePost = async (req, res) => {
  try {
    // Find post by ID and delete
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 