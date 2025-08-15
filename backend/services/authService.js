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
    try {
      if (isMissing(password, email)) {
        throw new Error('Email and password are required');
      }
      
      const query = `SELECT * FROM users WHERE email = $1`;
      const result = await pool.query(query, [email]);

      if (result.rows.length === 0) {
        throw new Error('The Email or Password is wrong');
      }

      const user = result.rows[0];
      const storedpasswordHash = user.password_hash;
      const isMatch = await bcrypt.compare(password, storedpasswordHash);

      if (!isMatch) {
        throw new Error('The Email or Password is wrong');
      }

      const jwtToken = generateAccessToken(user.userid, user.username, user.email);

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
      logger.error('Error during login in auth service:', err.message);
      throw new Error('Server error during login');
    }
  }

  async register(email, username, password) {
    try {
      if (isMissing(email, username, password)) {
        throw new Error('Email, username, and password are required');
      }

      const existQuery = `SELECT * FROM users WHERE email = $1 OR username = $2`;
      const existResult = await pool.query(existQuery, [email, username]);

      if (existResult.rows.length !== 0) {
        if (existResult.rows.some((u) => u.email === email)) {
          const error = new Error('An account with this email already exists');
          error.statusCode = 401;
          throw error;
        }
        if (existResult.rows.some((u) => u.username === username)) {
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

      return {
        message: 'Registration successful',
        userId: newUserId,
      };
    } catch (err) {
      logger.error('Error during registration in auth service:', err.message);
      throw new Error('Server error during registration');
    }
    
  }
}

module.exports = new AuthService();