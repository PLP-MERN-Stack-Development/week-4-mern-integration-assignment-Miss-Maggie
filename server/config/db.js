const mongoose = require('mongoose');

// Function to connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Log success message
    console.log('MongoDB connected');
  } catch (err) {
    // Log error and exit process if connection fails
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB; 