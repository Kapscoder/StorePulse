import { body, query, param, ValidationChain } from 'express-validator';

// ── User validators ──────────────────────────────────────────────
export const validateRegister: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Name must be between 2 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8–16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must include at least one uppercase letter')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('Password must include at least one special character'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters'),
];

export const validateLogin: ValidationChain[] = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateChangePassword: ValidationChain[] = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('New password must be 8–16 characters')
    .matches(/[A-Z]/)
    .withMessage('Must include at least one uppercase letter')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('Must include at least one special character'),
];

// ── Store validators ─────────────────────────────────────────────
export const validateCreateStore: ValidationChain[] = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Store name must be between 2 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid store email required'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters'),
  // Owner details (created together with store)
  body('ownerName')
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage('Owner name must be 2–60 characters'),
  body('ownerEmail')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid owner email required'),
  body('ownerPassword')
    .isLength({ min: 8, max: 16 })
    .withMessage('Owner password must be 8–16 characters')
    .matches(/[A-Z]/)
    .withMessage('Must include at least one uppercase letter')
    .matches(/[^a-zA-Z0-9]/)
    .withMessage('Must include at least one special character'),
];

// ── Rating validator ─────────────────────────────────────────────
export const validateRating: ValidationChain[] = [
  body('storeId').isMongoId().withMessage('Valid store ID required'),
  body('rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
];

export const validateRatingUpdate: ValidationChain[] = [
  param('storeId').isMongoId().withMessage('Valid store ID required'),
  body('rating')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
];

// ── Listing query validators ─────────────────────────────────────
export const validateListQuery: ValidationChain[] = [
  query('name').optional({ values: 'falsy' }).trim(),
  query('email').optional({ values: 'falsy' }).trim(),
  query('address').optional({ values: 'falsy' }).trim(),
  query('role').optional({ values: 'falsy' }).isIn(['admin', 'normal_user', 'store_owner']),
  query('sortBy').optional({ values: 'falsy' }).isIn(['name', 'email', 'address', 'role', 'rating', 'createdAt']),
  query('sortOrder').optional({ values: 'falsy' }).isIn(['asc', 'desc']),
  query('page').optional({ values: 'falsy' }).isInt({ min: 1 }),
  query('limit').optional({ values: 'falsy' }).isInt({ min: 1, max: 100 }),
];
