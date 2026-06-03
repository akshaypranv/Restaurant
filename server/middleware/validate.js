const { query, body, validationResult } = require('express-validator');

// Middleware to handle validation result check
const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }
  next();
};

// Search query validation
const validateSearch = [
  query('q')
    .exists().withMessage('Query parameter "q" is required')
    .isString().withMessage('Query parameter "q" must be a string')
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Query parameter "q" must be between 2 and 100 characters')
    // A simple regex check to reject suspicious SQL sequences in queries if we want to be extra safe
    .custom((val) => {
      const suspiciousPattern = /['";\-]/;
      if (suspiciousPattern.test(val)) {
        throw new Error('Search query contains invalid characters');
      }
      return true;
    }),
  checkValidationResult
];

// Admin login validation
const validateLogin = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  checkValidationResult
];

// Admin menu item validation — used for POST (create): all required fields enforced
const validateMenuItem = [
  body('category_id')
    .isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
  body('name')
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Name must be between 1 and 200 characters')
    .escape(),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('price_alt')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Alternative price must be a non-negative number'),
  body('price_label')
    .optional({ nullable: true })
    .isString().withMessage('Price label must be a string')
    .trim()
    .escape(),
  body('is_veg')
    .isBoolean().withMessage('is_veg must be a boolean value'),
  body('is_available')
    .optional()
    .isBoolean().withMessage('is_available must be a boolean value'),
  body('is_popular')
    .optional()
    .isBoolean().withMessage('is_popular must be a boolean value'),
  body('note')
    .optional({ nullable: true })
    .isString().withMessage('Note must be a string')
    .trim()
    .escape(),
  checkValidationResult
];

// Admin menu item update validation — used for PUT (update): all fields optional
// This allows partial updates like toggling is_available or is_popular individually
const validateMenuItemUpdate = [
  body('category_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .trim()
    .isLength({ min: 1, max: 200 }).withMessage('Name must be between 1 and 200 characters')
    .escape(),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('price_alt')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Alternative price must be a non-negative number'),
  body('price_label')
    .optional({ nullable: true })
    .isString().withMessage('Price label must be a string')
    .trim()
    .escape(),
  body('is_veg')
    .optional()
    .isBoolean().withMessage('is_veg must be a boolean value'),
  body('is_available')
    .optional()
    .isBoolean().withMessage('is_available must be a boolean value'),
  body('is_popular')
    .optional()
    .isBoolean().withMessage('is_popular must be a boolean value'),
  body('note')
    .optional({ nullable: true })
    .isString().withMessage('Note must be a string')
    .trim()
    .escape(),
  checkValidationResult
];

module.exports = {
  validateSearch,
  validateLogin,
  validateMenuItem,
  validateMenuItemUpdate
};
