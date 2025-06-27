const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateCategory, handleValidation } = require('../middleware/validation');

// Get all categories
router.get('/', categoryController.getAllCategories);
// Create a new category
router.post('/', validateCategory, handleValidation, categoryController.createCategory);

module.exports = router; 

// // routes/categoryRoutes.js
// const express = require('express');
// const router = express.Router();
// const categoryController = require('../controllers/categoryController');
// const { validateCategory, handleValidation } = require('../middleware/validation');

// // helper to catch async errors
// const asyncHandler = fn => (req, res, next) =>
//   Promise.resolve(fn(req, res, next)).catch(next);

// // debug logger for every /api/categories request
// router.use((req, res, next) => {
//   console.log(
//     `[CategoryRoute] ${req.method} ${req.originalUrl} →`,
//     req.method === 'POST' ? req.body : ''
//   );
//   next();
// });

// // GET /api/categories
// router.get(
//   '/',
//   asyncHandler(categoryController.getAllCategories)
// );

// // POST /api/categories
// router.post(
//   '/',
//   validateCategory,
//   handleValidation,
//   asyncHandler(categoryController.createCategory)
// );

// module.exports = router;
