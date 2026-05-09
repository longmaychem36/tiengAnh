// ============================================
// Role-Based Authorization Middleware (Hierarchical)
// ============================================

// Role hierarchy: superadmin > admin > member
const ROLE_HIERARCHY = {
  superadmin: 3,
  admin: 2,
  user: 1
};

/**
 * Check if a user's role meets the minimum required level
 */
function hasMinRole(userRole, requiredRole) {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

/**
 * Middleware: require user role to be in the allowed list
 * SuperAdmin automatically passes all role checks
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userRole = req.user.role;

    // SuperAdmin passes everything
    if (userRole === 'superadmin') return next();

    // Check if user's role is in the allowed list
    if (!roles.includes(userRole)) {
      return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
}

/**
 * Middleware: require minimum role level
 * e.g. requireRole('admin') allows admin + superadmin
 */
function requireRole(minRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!hasMinRole(req.user.role, minRole)) {
      return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
}

/**
 * Middleware: only superadmin
 */
function superAdminOnly() {
  return requireRole('superadmin');
}

module.exports = { authorize, requireRole, superAdminOnly };
