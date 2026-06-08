const db = require('../config/database');

// ── DASHBOARD STATS ──
// GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const [[{ total_users }]]    = await db.query('SELECT COUNT(*) AS total_users FROM users');
    const [[{ total_spots }]]    = await db.query('SELECT COUNT(*) AS total_spots FROM parking_spots');
    const [[{ total_bookings }]] = await db.query('SELECT COUNT(*) AS total_bookings FROM bookings');
    const [[{ total_revenue }]]  = await db.query("SELECT SUM(total_amount) AS total_revenue FROM bookings WHERE status = 'completed'");
    const [[{ active_bookings }]]= await db.query("SELECT COUNT(*) AS active_bookings FROM bookings WHERE status = 'active'");

    res.json({
      success: true,
      stats: {
        total_users,
        total_spots,
        total_bookings,
        total_revenue: total_revenue || 0,
        active_bookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── GET ALL USERS ──
// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── DELETE USER ──
// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── GET ALL BOOKINGS ──
// GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, ps.title AS spot_title, ps.city,
             u.name AS driver_name, o.name AS owner_name
      FROM bookings b
      JOIN parking_spots ps ON b.spot_id = ps.id
      JOIN users u ON b.driver_id = u.id
      JOIN users o ON ps.owner_id = o.id
      ORDER BY b.created_at DESC
    `);
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── TOGGLE SPOT ACTIVE STATUS ──
// PUT /api/admin/spots/:id/toggle
const toggleSpot = async (req, res) => {
  try {
    await db.query(
      'UPDATE parking_spots SET is_active = NOT is_active WHERE id = ?',
      [req.params.id]
    );
    res.json({ success: true, message: 'Spot status toggled!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDashboardStats, getAllUsers, deleteUser, getAllBookings, toggleSpot };
