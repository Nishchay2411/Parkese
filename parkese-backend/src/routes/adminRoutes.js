const router = require('express').Router();
const { getDashboardStats, getAllUsers, deleteUser, getAllBookings, toggleSpot } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats',            getDashboardStats);
router.get('/users',            getAllUsers);
router.delete('/users/:id',     deleteUser);
router.get('/bookings',         getAllBookings);
router.put('/spots/:id/toggle', toggleSpot);

module.exports = router;
