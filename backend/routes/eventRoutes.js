const express = require('express');
const router = express.Router();
const {
  createEvent, getUserEvents, getEventById,
  updateEvent, deleteEvent, addVendorToEvent, getRecommendations
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createEvent);
router.get('/', protect, getUserEvents);
router.get('/:id', protect, getEventById);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/vendors', protect, addVendorToEvent);
router.get('/:id/recommendations', protect, getRecommendations);

module.exports = router;