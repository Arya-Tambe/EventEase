const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Event = require('../models/Event');

// @desc Get all vendors (pending + verified)
// @route GET /api/admin/vendors
const getAllVendorsAdmin = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('user', 'name email phone');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve vendor
// @route PUT /api/admin/vendors/:id/approve
const approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isVerified: true, isSuspended: false },
      { returnDocument: 'after' }
    );
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reject/Suspend vendor
// @route PUT /api/admin/vendors/:id/suspend
const suspendVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isSuspended: true },
      { returnDocument: 'after' }
    );
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove vendor
// @route DELETE /api/admin/vendors/:id
const removeVendor = async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vendor removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Block/Unblock user
// @route PUT /api/admin/users/:id/block
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get dashboard stats
// @route GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVendors = await Vendor.countDocuments();
    const verifiedVendors = await Vendor.countDocuments({ isVerified: true });
    const totalEvents = await Event.countDocuments();

    const eventTypeAgg = await Event.aggregate([
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalUsers,
      totalVendors,
      verifiedVendors,
      totalEvents,
      popularEventTypes: eventTypeAgg
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllVendorsAdmin, approveVendor, suspendVendor, removeVendor,
  getAllUsers, toggleBlockUser, getStats
};