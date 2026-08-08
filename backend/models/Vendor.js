const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['Venue', 'Catering', 'Decoration', 'Photography', 'Videography', 'Entertainment', 'Sound & Lighting'],
    required: true
  },
  subcategory: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, default: '' },
  portfolio: [{ type: String }],
  packages: [{
    name: { type: String },
    description: { type: String },
    price: { type: Number }
  }],
  facilities: [{ type: String }],
  availableDates: [{ type: String }],
  bookedDates: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  trustScore: { type: Number, default: 0 }
  ,instagramHandle: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);