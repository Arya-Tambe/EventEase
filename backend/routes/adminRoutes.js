const express = require('express');
const router = express.Router();
const {
  getAllVendorsAdmin, approveVendor, suspendVendor, removeVendor,
  getAllUsers, toggleBlockUser, getStats
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/vendors', protect, adminOnly, getAllVendorsAdmin);
router.put('/vendors/:id/approve', protect, adminOnly, approveVendor);
router.put('/vendors/:id/suspend', protect, adminOnly, suspendVendor);
router.delete('/vendors/:id', protect, adminOnly, removeVendor);
router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/block', protect, adminOnly, toggleBlockUser);
router.get('/stats', protect, adminOnly, getStats);

module.exports = router;