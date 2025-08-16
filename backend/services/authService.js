const pool = require("../db");
const bcrypt = require("bcrypt");
const { isMissing } = require("../helpers/isMissing");
const logger = require("../utils/logger");
const { generateAccessToken } = require("../middleware/jwtHelper");

class AuthService {
  /**
   * Authenticate user login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data with JWT token
   */
  async login(email, password) {
    logger.info('AuthService.login called', { 
      email: email ? email.substring(0, 3) + '***' : 'missing',
      hasPassword: !!password
    });

    try {
      if (isMissing(password, email)) {
        logger.warn('AuthService.login validation failed', {
          hasEmail: !!email,
          hasPassword: !!password
        });
        throw new Error('Email and password are required');
      }
      
      const query = `SELECT * FROM users WHERE email = $1`;
      const result = await pool.query(query, [email]);

      if (result.rows.length === 0) {
        logger.warn('AuthService.login user not found', {
          email: email.substring(0, 3) + '***'
        });
        throw new Error('The Email or Password is wrong');
      }

      const user = result.rows[0];
      const storedpasswordHash = user.password_hash;
      const isMatch = await bcrypt.compare(password, storedpasswordHash);

      if (!isMatch) {
        logger.warn('AuthService.login password mismatch', {
          email: email.substring(0, 3) + '***',
          userId: user.userid
        });
        throw new Error('The Email or Password is wrong');
      }

      const jwtToken = generateAccessToken(user.userid, user.username, user.email);

      logger.info('AuthService.login successful', {
        userId: user.userid,
        username: user.username,
        email: user.email.substring(0, 3) + '***'
      });

      return {
        message: 'Logged in successfully',
        jwtToken,
        user: {
          id: user.userid,
          username: user.username,
          email: user.email,
        }
      };
    } catch (err) {
      logger.error('AuthService.login error', {
        email: email ? email.substring(0, 3) + '***' : 'missing',
        error: err.message,
        stack: err.stack
      });
      throw err;
    }
  }

  async register(email, username, password) {
    logger.info('AuthService.register called', { 
      email: email ? email.substring(0, 3) + '***' : 'missing',
      username: username ? username.substring(0, 3) + '***' : 'missing',
      passwordLength: password ? password.length : 0
    });

    try {
      if (isMissing(email, username, password)) {
        logger.warn('AuthService.register validation failed', {
          hasEmail: !!email,
          hasUsername: !!username,
          hasPassword: !!password
        });
        throw new Error('Email, username, and password are required');
      }

      const existQuery = `SELECT * FROM users WHERE email = $1 OR username = $2`;
      const existResult = await pool.query(existQuery, [email, username]);

      if (existResult.rows.length !== 0) {
        if (existResult.rows.some((u) => u.email === email)) {
          logger.warn('AuthService.register email already exists', {
            email: email.substring(0, 3) + '***'
          });
          const error = new Error('An account with this email already exists');
          error.statusCode = 401;
          throw error;
        }
        if (existResult.rows.some((u) => u.username === username)) {
          logger.warn('AuthService.register username already taken', {
            username: username.substring(0, 3) + '***'
          });
          const error = new Error('Username is already taken');
          error.statusCode = 401;
          throw error;
        }
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const insertQuery = `INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING userid`;
      const insertResult = await pool.query(insertQuery, [
        email,
        username,
        passwordHash,
      ]);

      const newUserId = insertResult.rows[0].userid;

      logger.info('AuthService.register successful', {
        userId: newUserId,
        email: email.substring(0, 3) + '***',
        username: username.substring(0, 3) + '***'
      });

      return {
        message: 'Registration successful',
        userId: newUserId,
      };
    } catch (err) {
      logger.error('AuthService.register error', {
        email: email ? email.substring(0, 3) + '***' : 'missing',
        username: username ? username.substring(0, 3) + '***' : 'missing',
        error: err.message,
        stack: err.stack
      });
      throw err;
    }
    
  }
}

module.exports = new AuthService();