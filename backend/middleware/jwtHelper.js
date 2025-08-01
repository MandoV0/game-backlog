import jwt from 'jsonwebtoken';

const SECRET_KEY = 'MySuperSecretKeyForSigning';

export const generateToken = (userid, username, email) => {
  return jwt.sign({ id: userid, username: username, email: email}, SECRET_KEY,  { expiresIn: '2h' });
};

export const isTokenValid = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No or malformed token provided' });
  }
  
  const token = authHeader.split(' ')[1];

  /* Is token valid? */
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};