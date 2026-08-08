const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Save a vendor
// @route POST /api/auth/saved-vendors/:vendorId
const saveVendor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.savedVendors.includes(req.params.vendorId)) {
      return res.status(400).json({ message: 'Vendor already saved' });
    }
    user.savedVendors.push(req.params.vendorId);
    await user.save();
    res.json({ message: 'Vendor saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get saved vendors
// @route GET /api/auth/saved-vendors
const getSavedVendors = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedVendors');
    res.json(user.savedVendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Remove saved vendor
// @route DELETE /api/auth/saved-vendors/:vendorId
const removeSavedVendor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.savedVendors = user.savedVendors.filter(
      id => id.toString() !== req.params.vendorId
    );
    await user.save();
    res.json({ message: 'Vendor removed from saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, saveVendor, getSavedVendors, removeSavedVendor };