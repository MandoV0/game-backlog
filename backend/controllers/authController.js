const pool = require("../db");
const bcrypt = require("bcrypt");

const { generateAccessToken } = require("../middleware/jwtHelper");
const authService = require("../services/authService");
const logger = require("../utils/logger");

/**
 * Handles user login by validating credentials and returning a signed JWT access token.
 *
 * @async
 * @param {Object} req - Request object.
 * @param {string} req.body.email - The users email address.
 * @param {string} req.body.password - The users plaintext password.
 * @param {Object} res - Response object.
 * @returns {Promise<void>} Sends a JSON response with:
 *  - 400 if email or password is missing
 *  - 401 if credentials are invalid
 *  - 200 with a signed JWT token and user details if successful
 *
 * @example
 * // POST /login
 * // Request body:
 * {
 *   "email": "user@example.com",
 *   "password": "mypassword"
 * }
 * // Response:
 * {
 *   "message": "Logged in successfully.",
 *   "jwtToken": "<JWT string>",
 *   "user": {
 *     "id": 1,
 *     "username": "miau",
 *     "email": "miau@outlook.com"
 *   }
 * }
 */
exports.login = async (req, res) => {
  const { password, email } = req.body;
  
  logger.info('Login attempt', { 
    email: email ? email.substring(0, 3) + '***' : 'missing',
    hasPassword: !!password,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  try {
    const result = await authService.login(email, password);
    
    logger.info('Login successful', { 
      userId: result.user.id,
      username: result.user.username,
      email: result.user.email.substring(0, 3) + '***'
    });
    
    res.status(200).json(result);
  } catch (err) {
    logger.error('Login failed', {
      email: email ? email.substring(0, 3) + '***' : 'missing',
      error: err.message,
      statusCode: err.statusCode || 500,
      stack: err.stack
    });
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error during login';
    res.status(statusCode).json({ message });
  }
};

/**
 * Handles user registration by validating input, checking for duplicate accounts,
 * hashing the password, and inserting the new user into the database.
 *
 * @async
 * @param {Object} req - Request object.
 * @param {string} req.body.email - The users email address.
 * @param {string} req.body.username - The usess chosen username.
 * @param {string} req.body.password - The users plaintext password.
 * @param {Object} res - Response object.
 * @returns {Promise<void>} Sends a JSON response with:
 *  - 400 if required fields are missing
 *  - 401 if the email is already registered
 *  - 201 with the new user's ID if successful
 *
 * @example
 * // POST /register
 * // Request body:
 * {
 *   "email": "newuser@example.com",
 *   "username": "new_user",
 *   "password": "supersecurepassword"
 * }
 * // Response:
 * {
 *   "message": "Registration successful",
 *   "userId": 5
 * }
 */
exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  
  logger.info('Registration attempt', { 
    email: email ? email.substring(0, 3) + '***' : 'missing',
    username: username ? username.substring(0, 3) + '***' : 'missing',
    hasPassword: !!password,
    passwordLength: password ? password.length : 0,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  try {
    const result = await authService.register(email, username, password);
    
    logger.info('Registration successful', { 
      userId: result.userId,
      email: email ? email.substring(0, 3) + '***' : 'missing',
      username: username ? username.substring(0, 3) + '***' : 'missing'
    });
    
    res.status(201).json(result);
  } catch (err) {
    logger.error('Registration failed', {
      email: email ? email.substring(0, 3) + '***' : 'missing',
      username: username ? username.substring(0, 3) + '***' : 'missing',
      error: err.message,
      statusCode: err.statusCode || 500,
      stack: err.stack
    });
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error during registration';
    res.status(statusCode).json({ message });
  }
};