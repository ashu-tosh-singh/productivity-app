const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ── Helper: generate a signed JWT ──────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                        // Payload — what's inside the token
    process.env.JWT_SECRET,                // Secret key to sign it
    { expiresIn: '7d' }                    // Token expires in 7 days
  );
};

// ── POST /api/auth/register ─────────────────────────────────────
const register = async (req, res) => {
  const { username, password } = req.body;

  // 1. Basic validation
  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  // 2. Check if username already taken
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    res.status(400);
    throw new Error('Username already taken');
  }

  // 3. Hash the password
  // Salt rounds = 10 means bcrypt runs 2^10 = 1024 hashing iterations
  // More rounds = harder to brute-force, but slower. 10 is the sweet spot.
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Save user to DB
  const user = await User.create({
    username,
    password: hashedPassword,
  });

  // 5. Return token (user is immediately logged in after registering)
  res.status(201).json({
    _id: user._id,
    username: user.username,
    token: generateToken(user._id),
  });
};

// ── POST /api/auth/login ────────────────────────────────────────
const login = async (req, res) => {
  const { username, password } = req.body;

  // 1. Validate input
  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  // 2. Find user by username
  const user = await User.findOne({ username });
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials'); // Vague on purpose — don't reveal if username exists
  }

  // 3. Compare plain password against hashed one in DB
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // 4. Return token
  res.json({
    _id: user._id,
    username: user.username,
    token: generateToken(user._id),
  });
};

// ── GET /api/auth/me ────────────────────────────────────────────
// Returns the currently logged-in user's info (used on app load)
const getMe = async (req, res) => {
  // req.user is set by the auth middleware
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

module.exports = { register, login, getMe };