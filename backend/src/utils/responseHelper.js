// ============================================
// Standardized API Response Helper
// ============================================

/**
 * Send a success response
 */
function success(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

/**
 * Send a created response (201)
 */
function created(res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201);
}

/**
 * Send an error response
 */
function error(res, message = 'Something went wrong', statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}

/**
 * Send a not found response
 */
function notFound(res, message = 'Resource not found') {
  return error(res, message, 404);
}

/**
 * Send a bad request response
 */
function badRequest(res, message = 'Bad request', errors = null) {
  return error(res, message, 400, errors);
}

/**
 * Send a paginated response
 */
function paginated(res, data, total, page, limit, message = 'Success', meta = {}) {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    },
    ...meta
  });
}

module.exports = { success, created, error, notFound, badRequest, paginated };
