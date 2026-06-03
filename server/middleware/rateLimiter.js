const rateLimit = require('express-rate-limit');

// Rate limiter for search requests: 30 requests per minute
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'error',
    message: 'Too many search requests from this IP, please try again after a minute',
    code: 'RATE_LIMITED'
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  }
});

// Rate limiter for login requests: 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again after 15 minutes',
    code: 'RATE_LIMITED'
  },
  handler: (req, res, next, options) => {
    res.status(429).json(options.message);
  }
});

module.exports = {
  searchLimiter,
  loginLimiter
};
