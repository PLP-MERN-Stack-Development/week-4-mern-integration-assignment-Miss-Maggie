const mongoose = require('mongoose');

// Define the schema for a category
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Each category name must be unique
    trim: true,   // Remove whitespace
  },
});

// Export the Category model
module.exports = mongoose.model('Category', categorySchema); 