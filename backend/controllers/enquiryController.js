const Enquiry = require('../models/Enquiry');

// @desc Send enquiry to vendor
// @route POST /api/enquiries
const createEnquiry = async (req, res) => {
  try {
    const { vendor, event, message, eventType, eventDate, guestCount, budget } = req.body;

    const enquiry = await Enquiry.create({
      user: req.user._id,
      vendor, event, message, eventType, eventDate, guestCount, budget
    });

    res.status(201).json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get enquiries sent by logged in user
// @route GET /api/enquiries/my
const getUserEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ user: req.user._id })
      .populate('vendor', 'businessName category')
      .sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get enquiries received by vendor
// @route GET /api/enquiries/vendor/:vendorId
const getVendorEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ vendor: req.params.vendorId })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reply to enquiry (vendor)
// @route PUT /api/enquiries/:id/reply
const replyToEnquiry = async (req, res) => {
  try {
    const Notification = require('../models/Notification');
    const enquiry = await Enquiry.findById(req.params.id).populate('user');
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

    enquiry.reply = req.body.reply;
    enquiry.status = 'replied';
    await enquiry.save();

    // Create notification for the user
    await Notification.create({
      user: enquiry.user._id,
      message: `Your enquiry has received a reply!`,
      type: 'enquiry_reply',
      link: `/enquiries`
    });

    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEnquiry, getUserEnquiries, getVendorEnquiries, replyToEnquiry };