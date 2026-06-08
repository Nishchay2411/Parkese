const router = require('express').Router();
const { getAllSpots, getSpot, createSpot, updateSpot, deleteSpot, mySpots } = require('../controllers/spotController');
const { protect, authorize } = require('../middleware/auth');

router.get('/',           getAllSpots);
router.get('/my-spots',   protect, authorize('owner', 'admin'), mySpots);
router.get('/:id',        getSpot);
router.post('/',          protect, authorize('owner', 'admin'), createSpot);
router.put('/:id',        protect, authorize('owner', 'admin'), updateSpot);
router.delete('/:id',     protect, authorize('owner', 'admin'), deleteSpot);

module.exports = router;
