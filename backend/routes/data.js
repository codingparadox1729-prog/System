// ─────────────────────────────────────────────────────────
//  routes/data.js  —  Save / Load game state
// ─────────────────────────────────────────────────────────
const express = require('express');
const { stmts } = require('../database');
const requireAuth = require('../middleware/auth');

const router = express.Router();

// All data routes require authentication
router.use(requireAuth);

// ── GET /api/data ──────────────────────────────────────────
// Load the current user's game state
router.get('/', (req, res) => {
  try {
    const row = stmts.getState.get(req.userId);
    if (!row) {
      // Return empty initial state if somehow missing
      return res.json({
        xp: 0, totalXP: 0, rankIndex: 0,
        habits: [], completions: {}, streak: 0,
        lastActive: null, xpHistory: [], log: [], penalties: [],
      });
    }
    return res.json(JSON.parse(row.state_json));
  } catch (err) {
    console.error('[GET STATE ERROR]', err);
    return res.status(500).json({ error: 'Failed to load game state.' });
  }
});

// ── POST /api/data ─────────────────────────────────────────
// Save the current user's game state
router.post('/', (req, res) => {
  try {
    const state = req.body;
    if (!state || typeof state !== 'object') {
      return res.status(400).json({ error: 'Invalid state data.' });
    }

    stmts.upsertState.run({
      user_id: req.userId,
      state_json: JSON.stringify(state),
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('[SAVE STATE ERROR]', err);
    return res.status(500).json({ error: 'Failed to save game state.' });
  }
});

module.exports = router;
