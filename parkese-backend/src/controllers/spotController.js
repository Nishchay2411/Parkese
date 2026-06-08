const db = require('../config/database');

// ── GET ALL SPOTS (Public) ──
// GET /api/spots?city=Indore&minPrice=10&maxPrice=50
const getAllSpots = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, search } = req.query;

    let query = `
      SELECT ps.*, u.name AS owner_name, u.phone AS owner_phone,
        (SELECT AVG(rating) FROM reviews WHERE spot_id = ps.id) AS avg_rating,
        (SELECT COUNT(*) FROM reviews WHERE spot_id = ps.id) AS total_reviews
      FROM parking_spots ps
      JOIN users u ON ps.owner_id = u.id
      WHERE ps.is_active = TRUE
    `;
    const params = [];

    if (city)     { query += ' AND ps.city = ?';              params.push(city); }
    if (minPrice) { query += ' AND ps.price_per_hour >= ?';   params.push(minPrice); }
    if (maxPrice) { query += ' AND ps.price_per_hour <= ?';   params.push(maxPrice); }
    if (search)   { query += ' AND (ps.title LIKE ? OR ps.address LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

    query += ' ORDER BY ps.created_at DESC';

    const [spots] = await db.query(query, params);
    res.json({ success: true, count: spots.length, spots });

  } catch (error) {
    console.error('Get spots error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── GET SINGLE SPOT ──
// GET /api/spots/:id
const getSpot = async (req, res) => {
  try {
    const [spots] = await db.query(`
      SELECT ps.*, u.name AS owner_name, u.phone AS owner_phone,
        (SELECT AVG(rating) FROM reviews WHERE spot_id = ps.id) AS avg_rating,
        (SELECT COUNT(*) FROM reviews WHERE spot_id = ps.id) AS total_reviews
      FROM parking_spots ps
      JOIN users u ON ps.owner_id = u.id
      WHERE ps.id = ?
    `, [req.params.id]);

    if (spots.length === 0) {
      return res.status(404).json({ success: false, message: 'Parking spot not found' });
    }

    // Get reviews
    const [reviews] = await db.query(`
      SELECT r.*, u.name AS driver_name FROM reviews r
      JOIN users u ON r.driver_id = u.id
      WHERE r.spot_id = ? ORDER BY r.created_at DESC
    `, [req.params.id]);

    res.json({ success: true, spot: spots[0], reviews });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── CREATE SPOT (Owner only) ──
// POST /api/spots
const createSpot = async (req, res) => {
  try {
    const { title, description, address, city, price_per_hour, total_slots, latitude, longitude } = req.body;

    if (!title || !address || !city || !price_per_hour) {
      return res.status(400).json({ success: false, message: 'Title, address, city and price are required' });
    }

    const [result] = await db.query(
      `INSERT INTO parking_spots 
       (owner_id, title, description, address, city, price_per_hour, total_slots, available_slots, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, title, description, address, city, price_per_hour,
       total_slots || 1, total_slots || 1, latitude || null, longitude || null]
    );

    res.status(201).json({
      success: true,
      message: 'Parking spot created successfully!',
      spotId: result.insertId
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── UPDATE SPOT (Owner only) ──
// PUT /api/spots/:id
const updateSpot = async (req, res) => {
  try {
    const [spots] = await db.query('SELECT owner_id FROM parking_spots WHERE id = ?', [req.params.id]);

    if (spots.length === 0) return res.status(404).json({ success: false, message: 'Spot not found' });
    if (spots[0].owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this spot' });
    }

    const { title, description, address, city, price_per_hour, total_slots, is_active } = req.body;

    await db.query(
      `UPDATE parking_spots SET title=?, description=?, address=?, city=?, 
       price_per_hour=?, total_slots=?, is_active=? WHERE id=?`,
      [title, description, address, city, price_per_hour, total_slots, is_active, req.params.id]
    );

    res.json({ success: true, message: 'Spot updated successfully!' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── DELETE SPOT (Owner only) ──
// DELETE /api/spots/:id
const deleteSpot = async (req, res) => {
  try {
    const [spots] = await db.query('SELECT owner_id FROM parking_spots WHERE id = ?', [req.params.id]);

    if (spots.length === 0) return res.status(404).json({ success: false, message: 'Spot not found' });
    if (spots[0].owner_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await db.query('DELETE FROM parking_spots WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Spot deleted successfully!' });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── GET MY SPOTS (Owner) ──
// GET /api/spots/my-spots
const mySpots = async (req, res) => {
  try {
    const [spots] = await db.query(`
      SELECT ps.*,
        (SELECT COUNT(*) FROM bookings WHERE spot_id = ps.id) AS total_bookings,
        (SELECT SUM(total_amount) FROM bookings WHERE spot_id = ps.id AND status = 'completed') AS total_earnings,
        (SELECT AVG(rating) FROM reviews WHERE spot_id = ps.id) AS avg_rating
      FROM parking_spots ps
      WHERE ps.owner_id = ?
      ORDER BY ps.created_at DESC
    `, [req.user.id]);

    res.json({ success: true, count: spots.length, spots });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllSpots, getSpot, createSpot, updateSpot, deleteSpot, mySpots };
