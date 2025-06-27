const { body, param, validationResult } = require('express-validator');

// Validation rules for creating/updating a Post
exports.validatePost = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
];

// Validation rules for creating a Category
exports.validateCategory = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
];

// Middleware to handle validation errors
exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}; 