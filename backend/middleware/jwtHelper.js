import jwt from 'jsonwebtoken';

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
export const generateAccessToken = (userid, username, email) => {
  return jwt.sign({ id: userid, username: username, email: email}, SECRET_KEY,  { expiresIn: '2h' });
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
export const isTokenValid = (req, res, next) => {
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
export const generateRefreshToken = (userid) => {
  return jwt.sign({ userid }, REFRESH_SECRET_KEY, { expiresIn: '7d'});
};