// ============================================
// Pagination Helper
// ============================================

/**
 * Parse pagination params from query string
 * @param {Object} query - req.query object
 * @returns {{ page: number, limit: number, offset: number }}
 */
function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Build ORDER BY clause for SQL queries
 * @param {string} sortBy - Column name
 * @param {string} order - 'asc' or 'desc'
 * @param {string[]} allowedColumns - Whitelist of sortable columns
 * @returns {string}
 */
function buildOrderBy(sortBy, order = 'asc', allowedColumns = []) {
  const safeOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
  if (allowedColumns.length && !allowedColumns.includes(sortBy)) {
    sortBy = allowedColumns[0];
  }
  return `ORDER BY ${sortBy} ${safeOrder}`;
}

module.exports = { parsePagination, buildOrderBy };
