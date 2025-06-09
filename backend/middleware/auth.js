const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'temporary_secret_key_do_not_use_in_production';

exports.generateToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Get token from cookie
    else if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
      // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id);
        
      if (!user) {
        return next(new ErrorResponse('User not found', 401));
      }

      // Check if user is active
      if (!user.isActive) {
        return next(new ErrorResponse('User account is deactivated', 401));
        }

      // Add user to request
      req.user = user;
        next();
    } catch (error) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  } catch (error) {
    return next(error);
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
}; 