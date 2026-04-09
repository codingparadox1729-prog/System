// ─────────────────────────────────────────────────────────
//  routes/auth.js  —  Signup / Login / Me
// ─────────────────────────────────────────────────────────
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { stmts } = require('../database');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// ── Helpers ────────────────────────────────────────────────
function signToken(userId, hunterName) {
  return jwt.sign(
    { userId, hunterName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── POST /api/auth/signup ──────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { email, hunterName, password } = req.body;

    // ── Validation
    if (!email || !hunterName || !password) {
      return res.status(400).json({ error: '[ERROR] All fields are required.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ error: '[ERROR] Invalid email address.' });
    }
    if (hunterName.trim().length < 3) {
      return res.status(400).json({ error: '[ERROR] Hunter name must be at least 3 characters.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '[ERROR] Password must be at least 6 characters.' });
    }

    // ── Check if email already registered
    const existing = stmts.findUserByEmail.get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: '[ERROR] Email already registered. Please log in.' });
    }

    // ── Hash password & create user
    const hashed = await bcrypt.hash(password, 12);
    const info = stmts.createUser.run({
      email: email.toLowerCase(),
      hunter_name: hunterName.trim().toUpperCase(),
      password: hashed,
    });

    const userId = info.lastInsertRowid;

    // ── Create initial game state for the user
    const initialState = {
      xp: 0,
      totalXP: 0,
      rankIndex: 0,
      habits: [],
      completions: {},
      streak: 0,
      lastActive: null,
      xpHistory: [],
      log: [{
        time: new Date().toLocaleString(),
        msg: `Hunter ${hunterName.trim().toUpperCase()} has awakened. Welcome to the System.`
      }],
      penalties: [],
    };
    stmts.upsertState.run({
      user_id: userId,
      state_json: JSON.stringify(initialState),
    });

    // ── Sign token and respond
    const token = signToken(userId, hunterName.trim().toUpperCase());
    return res.status(201).json({
      token,
      user: { id: userId, email: email.toLowerCase(), hunterName: hunterName.trim().toUpperCase() },
    });

  } catch (err) {
    console.error('[SIGNUP ERROR]', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── POST /api/auth/login ───────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '[ERROR] Email and password are required.' });
    }

    // ── Find user
    const user = stmts.findUserByEmail.get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: '[ERROR] Invalid email or password.' });
    }

    // ── Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: '[ERROR] Invalid email or password.' });
    }

    // ── Sign token and respond
    const token = signToken(user.id, user.hunter_name);
    return res.json({
      token,
      user: { id: user.id, email: user.email, hunterName: user.hunter_name },
    });

  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// ── GET /api/auth/me ───────────────────────────────────────
// Verifies the token and returns user info (used on page reload)
router.get('/me', requireAuth, (req, res) => {
  const user = stmts.findUserById.get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  return res.json({
    user: { id: user.id, email: user.email, hunterName: user.hunter_name },
  });
});

module.exports = router;
