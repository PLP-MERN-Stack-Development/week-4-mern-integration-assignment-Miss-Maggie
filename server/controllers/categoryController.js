// const Category = require('../models/Category');

// // Get all categories
// exports.getAllCategories = async (req, res) => {
//   try {
//     // Fetch all categories from the database
//     const categories = await Category.find();
//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Create a new category
// exports.createCategory = async (req, res) => {
//   try {
//     const { name } = req.body;
//     // Create and save new category
//     const newCategory = new Category({ name });
//     const savedCategory = await newCategory.save();
//     res.status(201).json(savedCategory);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// }; 


const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.json(categories);
  } catch (err) {
    console.error('getAllCategories error', err);
    return res.status(500).json({ error: 'Server error fetching categories' });
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ error: 'Category already exists' });
    }
    const category = await Category.create({ name });
    return res.status(201).json(category);
  } catch (err) {
    console.error('createCategory error', err);
    return res.status(500).json({ error: 'Server error creating category' });
  }
};
