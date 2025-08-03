const pool = require("../db");
const bcrypt = require("bcrypt");

const { isMissing } = require("../helpers/isMissing");
const { generateToken } = require("../middleware/jwtHelper");

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
      return res.status(401).json({message: "The Username or Password is wrong."});
    }

    const user = result.rows[0];
    const storedpasswordHash = user.password_hash;
    const isMatch = await bcrypt.compare(password, storedpasswordHash);

    console.log(storedpasswordHash);
    console.log(password);
    console.log(isMatch);

    if (!isMatch) { 
      return res.status(401).json({message: "The Username or Password is wrong."});
    }

    const jwtToken = generateToken(user.userid, user.username, user.email);

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

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (isMissing(email, username, password)) {
      return res
        .status(400)
        .json({ error: "Email, username, and password are required." });
    }

    const existQuery = `SELECT * FROM users WHERE email = $1`;
    const existResult = await pool.query(existQuery, [email]);

    if (existResult.rows.length !== 0) {
      return res.status(401).send("An Account with this email already exists.");
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
