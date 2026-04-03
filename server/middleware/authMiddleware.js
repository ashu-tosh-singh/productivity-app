const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the Authorization header as: "Bearer <token>"
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — no token');
  }

  // Verify the token hasn't been tampered with or expired
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Attach the user object to the request (minus password)
  // Now every protected route knows WHO is making the request
  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    res.status(401);
    throw new Error('User no longer exists');
  }

  next(); // Pass control to the actual route handler
};

module.exports = { protect };