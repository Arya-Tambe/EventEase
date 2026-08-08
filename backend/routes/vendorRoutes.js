const express = require('express');
const router = express.Router();
const { protect, vendorOnly } = require('../middleware/authMiddleware');
const upload = require('../config/upload');
const { createVendor, getMyVendorProfile, updateVendorProfile, searchVendors, getVendorById, getAllVendors, addPortfolioImage, deletePortfolioImage } = require('../controllers/vendorController');

router.get('/search', searchVendors);
router.get('/', getAllVendors);
router.get('/profile', protect, vendorOnly, getMyVendorProfile);
router.post('/', protect, vendorOnly, createVendor);
router.put('/profile', protect, vendorOnly, updateVendorProfile);
router.post('/portfolio', protect, vendorOnly, upload.single('image'), addPortfolioImage);
router.get('/:id', getVendorById);
router.delete('/portfolio/:index', protect, vendorOnly, deletePortfolioImage);

module.exports = router;