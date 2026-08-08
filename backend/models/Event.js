const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventName: { type: String, required: true },
  eventType: {
    type: String,
    enum: ['Wedding', 'Birthday', 'Corporate', 'Conference', 'Anniversary', 'Social Gathering', 'Other'],
    required: true
  },
  date: { type: Date, required: true },
  city: { type: String, required: true },
  guestCount: { type: Number, required: true },
  budget: { type: Number, required: true },
  description: { type: String, default: '' },
  requiredServices: [{ type: String }],
  optionalServices: [{ type: String }],
  selectedVendors: [{
    service: { type: String },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    packageName: { type: String },
    price: { type: Number },
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' }
  }],
  totalSpent: { type: Number, default: 0 },
  readinessPercentage: { type: Number, default: 0 },
  status: { type: String, enum: ['planning', 'confirmed', 'completed', 'cancelled'], default: 'planning' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);