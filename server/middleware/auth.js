const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Middleware to verify JWT authentication tokens on protected routes.
 * Expects header format: Authorization: Bearer <token>
 */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. No token provided.',
      code: 'UNAUTHORIZED'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired authentication token.',
      code: 'UNAUTHORIZED'
    });
  }
};

module.exports = auth;
