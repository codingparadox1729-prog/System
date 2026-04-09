// ─────────────────────────────────────────────────────────
//  server.js  —  SYSTEM: Arise — Express Backend
// ─────────────────────────────────────────────────────────
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
    'http://localhost:5500',
    'http://127.0.0.1:5501',
    'http://localhost:5501',
    'null', // for opening HTML file directly in browser
  ],
  credentials: true,
}));

app.use(express.json({ limit: '5mb' }));  // 5MB to handle large game states

// ── Serve frontend (optional, for production) ──────────────
// Uncomment these lines if you want the backend to also serve
// the frontend HTML file:
//
// app.use(express.static(path.join(__dirname, '../frontend')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/index.html'));
// });

// ── API Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'SYSTEM ONLINE', timestamp: new Date().toISOString() });
});

// ── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ██████╗ ██╗   ██╗███████╗████████╗███████╗███╗   ███╗`);
  console.log(`  ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║`);
  console.log(`  ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║`);
  console.log(`  ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║`);
  console.log(`  ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║`);
  console.log(`  ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝`);
  console.log(`\n  [SYSTEM ONLINE] Server running at http://localhost:${PORT}`);
  console.log(`  [API READY]     http://localhost:${PORT}/api/health\n`);
});
