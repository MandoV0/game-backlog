const jwt = require('jsonwebtoken');

const ACCESS_SECRET_KEY = 'MySuperSecretKeyForSigning';
const REFRESH_SECRET_KEY = 'MySuperSecretKeyForSigningRefresh';

/**
 * Generates a signed JWT access token.
 * 
 * @param {string | number} userid - Unique identifier of the user.
 * @param {string} username - Username of the user.
 * @param {string} email - Email address of the user.
 * @returns {string} A signed JWT access token valid for 2 hours.
 */
const generateAccessToken = (userid, username, email) => {
  return jwt.sign({ id: userid, username: username, email: email}, ACCESS_SECRET_KEY,  { expiresIn: '2h' });
};

/**
 * Middleware that validates the Bearer access token from the Authorization header.
 * If valid, attaches decoded payload to 'req.user' and calls 'next()'.
 * 
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Callback to pass control to the next middleware function.
 * @returns {void} Sends a 401 response if the token is missing, malformed, invalid or expired.
 */
const isTokenValid = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No or malformed token provided' });
  }
  
  const token = authHeader.split(' ')[1];

  /* Is token valid? */
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};


/**
 * Generates a signed JWT refresh token.
 * 
 * @param {string | number} userid - Unique identifier of the user.
 * @returns {string} A signed JWT refresh token valid for 7 days.
 */
const generateRefreshToken = (userid) => {
  return jwt.sign({ userid }, REFRESH_SECRET_KEY, { expiresIn: '7d'});
};

const JWT_CONFIG = {
  ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET || ACCESS_SECRET_KEY,
  ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  ALGORITHM: 'HS256'
}

/**
 * Verifies a JWT token using the provided secret key.
 *
 * @param {string} token - The JWT token to verify.
 * @param {string} secret - The secret key to use for verification.
 * @returns {Object} The decoded payload if the token is valid, or an error if invalid.
 */
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
}

module.exports = {
  generateAccessToken,
  isTokenValid,
  generateRefreshToken,
  JWT_CONFIG,
  verifyToken
};