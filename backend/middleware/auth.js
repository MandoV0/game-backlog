const { verifyToken, JWT_CONFIG } = require("./jwtHelper");
const logger = require("../utils/logger");

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
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required",
        message: "No or malformed token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Token is missing",
      });
    }

    const decoded = verifyToken(token, JWT_CONFIG.ACCESS_SECRET_KEY);

    req.user = decoded;
    next();
  } catch (err) {
    logger.error("Error occurred during token validation", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
        message: "Access token has expired",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        message: "Token is invalid",
      });
    }

    return res.status(401).json({
      error: "Authentication failed",
      message: "Invalid or expired token",
    });
  }
};

/**
 * Middleware that optionally validates the Bearer access token from the Authorization header.
 * If valid, attaches decoded payload to 'req.user' and calls 'next()'.
 *
 * @param {Object} req - Request object.
 * @param {Object} res - Response object.
 * @param {Function} next - Callback to pass control to the next middleware function.
 */
const optionalAuth = (req, res, next) => {
  try {

    const authHeader = req.headers["authorization"];
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }
  
    const token = authHeader.split(" ")[1];
  
    if (!token) {
      return next();
    }
  
    const decoded = verifyToken(token, JWT_CONFIG.ACCESS_SECRET_KEY);
  
    req.user = decoded;
    next();
  } catch (err) {
    logger.error("Error occurred during optional token validation", err.message);
    next();
  }
};

module.exports = { isTokenValid, optionalAuth };