// Load environment variables from .env file
require('dotenv').config();

// Import core modules and dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db'); // MongoDB connection logic
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// Middleware: Enable CORS and parse JSON bodies
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is running' });
});

// Connect to MongoDB
connectDB();

// API routes
app.use('/api/posts', postRoutes);      // Blog post endpoints
app.use('/api/categories', categoryRoutes); // Category endpoints
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentRoutes);

// Custom error handler (should be last)
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
