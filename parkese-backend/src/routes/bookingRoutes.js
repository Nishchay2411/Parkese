const router = require('express').Router();
const { createBooking, myBookings, spotBookings, getBooking, updateBookingStatus, extendBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.post('/',                  protect, authorize('driver'), createBooking);
router.get('/my-bookings',        protect, authorize('driver'), myBookings);
router.get('/spot-bookings',      protect, authorize('owner', 'admin'), spotBookings);
router.get('/:id',                protect, getBooking);
router.put('/:id/status',         protect, updateBookingStatus);
router.put('/:id/extend',         protect, authorize('driver'), extendBooking);

module.exports = router;
