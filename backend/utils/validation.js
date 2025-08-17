const { isMissing } = require('../helpers/isMissing');

/**
 * Validates pagination parameters
 * @param {Object} query - Request query object
 * @returns {Object} Validation result with limit and offset
 */
const validatePagination = (query) => {
  const limit = parseInt(query.limit) || 10;
  const offset = parseInt(query.offset) || 0;

  if (limit < 1 || limit > 100) {
    throw new Error('Limit must be between 1 and 100');
  }

  if (offset < 0) {
    throw new Error('Offset must be non-negative');
  }

  return { limit, offset };
};

/**
 * Validates game ID parameter
 * @param {string} id - Game ID string
 * @returns {number} Validated game ID
 */
const validateGameId = (id) => {
  const gameId = parseInt(id);
  
  if (isNaN(gameId) || gameId <= 0) {
    throw new Error('Invalid game ID');
  }
  
  return gameId;
};

/**
 * Validates multiple game IDs
 * @param {string} ids - Comma-separated game IDs
 * @returns {Array<number>} Array of validated game IDs
 */
const validateGameIds = (ids) => {
  const gameIds = ids.split(',').map(id => parseInt(id.trim()));
  
  if (!gameIds.length || gameIds.some(isNaN) || gameIds.some(id => id <= 0)) {
    throw new Error('Invalid game IDs');
  }
  
  return gameIds;
};

/**
 * Validates user registration data
 * @param {Object} data - Registration data
 * @returns {Object} Validated data
 */
const validateRegistration = (data) => {
  const { email, username, password } = data;

  if (isMissing(email, username, password)) {
    throw new Error('Email, username, and password are required');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  // Username validation
  if (username.length < 3 || username.length > 30) {
    throw new Error('Username must be between 3 and 30 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error('Username can only contain letters, numbers, and underscores');
  }

  // Password validation
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  return { email: email.toLowerCase().trim(), username: username.trim(), password };
};

/**
 * Validates login data
 * @param {Object} data - Login data
 * @returns {Object} Validated data
 */
const validateLogin = (data) => {
  const { email, password } = data;

  if (isMissing(email, password)) {
    throw new Error('Email and password are required');
  }

  return { email: email.toLowerCase().trim(), password };
};

/**
 * Validates review data
 * @param {Object} data - Review data
 * @returns {Object} Validated data
 */
const validateReview = (data) => {
  const { rating, review_text } = data;

  if (isMissing(review_text)) {
    throw new Error('Review text is required');
  }

  const ratingNum = validateRating(rating);

  if (review_text.length < 10 || review_text.length > 1000) {
    throw new Error('Review text must be between 10 and 1000 characters');
  }

  return { rating: ratingNum, review_text: review_text };
};

const validateRating = (rating) => {
  const ratingNum = parseInt(rating);

  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  return ratingNum;
};

/**
 * Sanitizes input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
};

/**
 * Sanitizes object properties
 * @param {Object} obj - Object to sanitize
 * @returns {Object} Sanitized object
 */
const sanitizeObject = (obj) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

module.exports = {
  validatePagination,
  validateGameId,
  validateGameIds,
  validateRegistration,
  validateLogin,
  validateReview,
  sanitizeInput,
  sanitizeObject
};