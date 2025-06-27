const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { validatePost, handleValidation } = require('../middleware/validation');

// Get all posts
router.get('/', postController.getAllPosts);
// Get a single post by ID
router.get('/:id', postController.getPostById);
// Create a new post
router.post('/', validatePost, handleValidation, postController.createPost);
// Update an existing post
router.put('/:id', validatePost, handleValidation, postController.updatePost);
// Delete a post
router.delete('/:id', postController.deletePost);

module.exports = router; 