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
  const authHeader = req.headers["authorization"];
  const ip = req.ip;
  const userAgent = req.get('User-Agent');

  logger.info('Token validation attempt', {
    hasAuthHeader: !!authHeader,
    ip,
    userAgent: userAgent ? userAgent.substring(0, 50) + '...' : 'missing',
    path: req.path,
    method: req.method
  });

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn('Token validation failed - no or malformed token', {
        hasAuthHeader: !!authHeader,
        authHeaderPrefix: authHeader ? authHeader.substring(0, 10) + '...' : 'none',
        ip,
        path: req.path
      });
      return res.status(401).json({
        error: "Authentication required",
        message: "No or malformed token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      logger.warn('Token validation failed - empty token', {
        ip,
        path: req.path
      });
      return res.status(401).json({
        error: "Authentication required",
        message: "Token is missing",
      });
    }

    const decoded = verifyToken(token, JWT_CONFIG.ACCESS_SECRET_KEY);

    req.user = decoded;
    
    logger.info('Token validation successful', {
      userId: decoded.id,
      username: decoded.username,
      ip,
      path: req.path
    });
    
    next();
  } catch (err) {
    logger.error("Token validation error", {
      error: err.message,
      errorName: err.name,
      ip,
      path: req.path,
      stack: err.stack
    });

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
  const authHeader = req.headers["authorization"];
  const ip = req.ip;
  const userAgent = req.get('User-Agent');

  logger.debug('Optional token validation attempt', {
    hasAuthHeader: !!authHeader,
    ip,
    userAgent: userAgent ? userAgent.substring(0, 50) + '...' : 'missing',
    path: req.path,
    method: req.method
  });

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.debug('Optional token validation - no token provided', {
        ip,
        path: req.path
      });
      return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      logger.debug('Optional token validation - empty token', {
        ip,
        path: req.path
      });
      return next();
    }

    const decoded = verifyToken(token, JWT_CONFIG.ACCESS_SECRET_KEY);

    req.user = decoded;
    
    logger.debug('Optional token validation successful', {
      userId: decoded.id,
      username: decoded.username,
      ip,
      path: req.path
    });
    
    next();
  } catch (err) {
    logger.debug("Optional token validation failed, continuing without auth", {
      error: err.message,
      ip,
      path: req.path
    });
    next();
  }
};

module.exports = { isTokenValid, optionalAuth };