const Vendor = require('../models/Vendor');

// @desc Create vendor profile
// @route POST /api/vendors
const createVendor = async (req, res) => {
  try {
    const existing = await Vendor.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: 'Vendor profile already exists' });

    const vendor = await Vendor.create({ ...req.body, user: req.user._id });
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get vendor profile
// @route GET /api/vendors/profile
const getMyVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update vendor profile
// @route PUT /api/vendors/profile
const updateVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { returnDocument: 'after' }
    );
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Search vendors by category, location, date
// @route GET /api/vendors/search
const searchVendors = async (req, res) => {
  try {
    const { category, subcategory, location, date } = req.query;
    let query = { isVerified: true, isSuspended: false };

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (date) query.bookedDates = { $nin: [date] };

    const vendors = await Vendor.find(query);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get vendor by ID
// @route GET /api/vendors/:id
const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('user', 'name email');
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all vendors (public)
// @route GET /api/vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isVerified: true, isSuspended: false });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc Add portfolio image
// @route POST /api/vendors/portfolio
const addPortfolioImage = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });

    const imagePath = req.file.location
      ? req.file.location
      : `/uploads/${req.file.filename}`;

    vendor.portfolio.push(imagePath);
    await vendor.save();
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc Delete portfolio image
// @route DELETE /api/vendors/portfolio/:index
const deletePortfolioImage = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });
    const index = parseInt(req.params.index);
    if (index < 0 || index >= vendor.portfolio.length) {
      return res.status(400).json({ message: 'Invalid image index' });
    }
    vendor.portfolio.splice(index, 1);
    await vendor.save();
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createVendor, getMyVendorProfile, updateVendorProfile, searchVendors, getVendorById, getAllVendors, addPortfolioImage, deletePortfolioImage };