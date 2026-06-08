const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ──
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/spots',    require('./routes/spotRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));

// ── HEALTH CHECK ──
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚗 ParkEase API is running!',
    version: '1.0.0',
    endpoints: {
      auth:     '/api/auth',
      spots:    '/api/spots',
      bookings: '/api/bookings',
      admin:    '/api/admin'
    }
  });
});

// ── 404 HANDLER ──
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// ── START SERVER ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚗 ParkEase Backend running on http://localhost:${PORT}`);
  console.log(`📋 API Docs: http://localhost:${PORT}/\n`);
});
