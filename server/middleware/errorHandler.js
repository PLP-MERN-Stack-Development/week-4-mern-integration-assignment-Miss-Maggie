// Custom error handling middleware for Express
module.exports = (err, req, res, next) => {
  // Log the error stack trace for debugging
  console.error(err.stack);
  // Send a JSON response with error details
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
}; 