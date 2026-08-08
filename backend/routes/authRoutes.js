const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, getUserProfile, updateUserProfile, saveVendor, getSavedVendors, removeSavedVendor } = require('../controllers/authController');
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/saved-vendors/:vendorId', protect, saveVendor);
router.get('/saved-vendors', protect, getSavedVendors);
router.delete('/saved-vendors/:vendorId', protect, removeSavedVendor);

module.exports = router;