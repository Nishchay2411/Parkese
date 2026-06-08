const db = require('../config/database');

// ── CREATE BOOKING (Driver) ──
// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { spot_id, start_time, end_time, vehicle_number } = req.body;

    if (!spot_id || !start_time || !end_time) {
      return res.status(400).json({ success: false, message: 'Spot ID, start time and end time are required' });
    }

    // Get spot details
    const [spots] = await db.query(
      'SELECT * FROM parking_spots WHERE id = ? AND is_active = TRUE',
      [spot_id]
    );
    if (spots.length === 0) {
      return res.status(404).json({ success: false, message: 'Parking spot not found or unavailable' });
    }
    const spot = spots[0];

    // Check availability
    if (spot.available_slots <= 0) {
      return res.status(400).json({ success: false, message: 'No slots available at this spot' });
    }

    // Check for time conflicts
    const [conflicts] = await db.query(`
      SELECT id FROM bookings
      WHERE spot_id = ? AND status IN ('pending','active')
      AND NOT (end_time <= ? OR start_time >= ?)
    `, [spot_id, start_time, end_time]);

    if (conflicts.length >= spot.total_slots) {
      return res.status(400).json({ success: false, message: 'This slot is already booked for the selected time' });
    }

    // Calculate hours and amount
    const start  = new Date(start_time);
    const end    = new Date(end_time);
    const hours  = Math.ceil((end - start) / (1000 * 60 * 60));
    const amount = hours * spot.price_per_hour;

    if (hours <= 0) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' });
    }

    // Create booking
    const [result] = await db.query(
      `INSERT INTO bookings (driver_id, spot_id, start_time, end_time, hours, total_amount, vehicle_number)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, spot_id, start_time, end_time, hours, amount, vehicle_number || null]
    );

    // Decrease available slots
    await db.query(
      'UPDATE parking_spots SET available_slots = available_slots - 1 WHERE id = ?',
      [spot_id]
    );

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking: {
        id: result.insertId,
        spot_title: spot.title,
        address: spot.address,
        start_time, end_time, hours,
        total_amount: amount,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── GET MY BOOKINGS (Driver) ──
// GET /api/bookings/my-bookings
const myBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, ps.title AS spot_title, ps.address, ps.city,
             ps.price_per_hour, u.name AS owner_name, u.phone AS owner_phone
      FROM bookings b
      JOIN parking_spots ps ON b.spot_id = ps.id
      JOIN users u ON ps.owner_id = u.id
      WHERE b.driver_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.id]);

    res.json({ success: true, count: bookings.length, bookings });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── GET BOOKINGS FOR MY SPOTS (Owner) ──
// GET /api/bookings/spot-bookings
const spotBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, ps.title AS spot_title, ps.address,
             u.name AS driver_name, u.phone AS driver_phone
      FROM bookings b
      JOIN parking_spots ps ON b.spot_id = ps.id
      JOIN users u ON b.driver_id = u.id
      WHERE ps.owner_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.id]);

    res.json({ success: true, count: bookings.length, bookings });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── GET SINGLE BOOKING ──
// GET /api/bookings/:id
const getBooking = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, ps.title AS spot_title, ps.address, ps.city,
             ps.latitude, ps.longitude, ps.price_per_hour,
             u.name AS driver_name, o.name AS owner_name, o.phone AS owner_phone
      FROM bookings b
      JOIN parking_spots ps ON b.spot_id = ps.id
      JOIN users u ON b.driver_id = u.id
      JOIN users o ON ps.owner_id = o.id
      WHERE b.id = ?
    `, [req.params.id]);

    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const booking = bookings[0];

    // Only the driver or owner can see this booking
    if (booking.driver_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── UPDATE BOOKING STATUS ──
// PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'active', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const [bookings] = await db.query('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (bookings.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);

    // If cancelled or completed — restore available slot
    if (status === 'cancelled' || status === 'completed') {
      await db.query(
        'UPDATE parking_spots SET available_slots = available_slots + 1 WHERE id = ?',
        [bookings[0].spot_id]
      );
    }

    res.json({ success: true, message: `Booking ${status} successfully!` });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ── EXTEND BOOKING ──
// PUT /api/bookings/:id/extend
const extendBooking = async (req, res) => {
  try {
    const { extra_hours } = req.body;
    if (!extra_hours || extra_hours <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid extra hours' });
    }

    const [bookings] = await db.query(
      'SELECT b.*, ps.price_per_hour FROM bookings b JOIN parking_spots ps ON b.spot_id = ps.id WHERE b.id = ?',
      [req.params.id]
    );

    if (bookings.length === 0) return res.status(404).json({ success: false, message: 'Booking not found' });

    const booking = bookings[0];
    const newEndTime    = new Date(new Date(booking.end_time).getTime() + extra_hours * 3600000);
    const extraAmount   = extra_hours * booking.price_per_hour;
    const newHours      = booking.hours + extra_hours;
    const newTotal      = booking.total_amount + extraAmount;

    await db.query(
      'UPDATE bookings SET end_time = ?, hours = ?, total_amount = ? WHERE id = ?',
      [newEndTime, newHours, newTotal, req.params.id]
    );

    res.json({
      success: true,
      message: `Booking extended by ${extra_hours} hour(s)!`,
      new_end_time: newEndTime,
      extra_charge: extraAmount,
      new_total: newTotal
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createBooking, myBookings, spotBookings, getBooking, updateBookingStatus, extendBooking };
