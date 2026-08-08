const express = require('express');
const router = express.Router();
const {
  createEnquiry, getUserEnquiries, getVendorEnquiries, replyToEnquiry
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createEnquiry);
router.get('/my', protect, getUserEnquiries);
router.get('/vendor/:vendorId', protect, getVendorEnquiries);
router.put('/:id/reply', protect, replyToEnquiry);

module.exports = router;