const pool = require("../db");
const bcrypt = require("bcrypt");

const { isMissing } = require("../helpers/isMissing");
const { generateAccessToken } = require("../middleware/jwtHelper");

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
  try {
    const { password, email } = req.body;

    if (isMissing(password, email)) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);

    if (result.rows.length == 0) {
      return res
        .status(401)
        .json({ message: "The Username or Password is wrong." });
    }

    const user = result.rows[0];
    const storedpasswordHash = user.password_hash;
    const isMatch = await bcrypt.compare(password, storedpasswordHash);

    console.log(storedpasswordHash);
    console.log(password);
    console.log(isMatch);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "The Username or Password is wrong." });
    }

    const jwtToken = generateAccessToken(
      user.userid,
      user.username,
      user.email
    );

    res.status(200).json({
      message: "Logged in successfully.",
      jwtToken,
      user: {
        id: user.userid,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error during login" });
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
  try {
    const { email, username, password } = req.body;

    if (isMissing(email, username, password)) {
      return res
        .status(400)
        .json({ error: "Email, username, and password are required." });
    }

    const existQuery = `SELECT * FROM users WHERE email = $1 OR username $2`;
    const existResult = await pool.query(existQuery, [email]);

    if (existResult.rows.length !== 0) {
      if (existResult.rows.some((u) => u.email === email)) {
        return res
          .status(401)
          .send("An account with this email already exists.");
      }
      if (existResult.rows.some((u) => u.username === username)) {
        return res.status(401).send("Username is already taken.");
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

    return res
      .status(201)
      .json({ message: "Registration successful", userId: newUserId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error during registration" });
  }
};
