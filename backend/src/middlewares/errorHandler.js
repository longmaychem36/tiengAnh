// ============================================
// Global Error Handler Middleware
// ============================================

/**
 * Centralized error handling middleware
 * Catches all errors passed via next(error)
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // SQL Server specific errors
  if (err.code === 'EREQUEST' || err.code === 'ETIMEOUT') {
    return res.status(500).json({
      success: false,
      message: 'Database error occurred.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Validation errors
  if (err.type === 'validation') {
    return res.status(400).json({
      success: false,
      message: 'Validation error.',
      errors: err.errors || []
    });
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds the limit.'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field.'
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
