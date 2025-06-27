const express = require('express');
const router = express.Router();
const { getCommentsByPost, createComment } = require('../controllers/commentController');

router.get('/:postId', getCommentsByPost);
router.post('/:postId', createComment);

module.exports = router; 