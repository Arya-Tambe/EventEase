const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  message: { type: String, required: true },
  eventType: { type: String },
  eventDate: { type: Date },
  guestCount: { type: Number },
  budget: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'viewed', 'replied', 'closed'],
    default: 'pending'
  },
  reply: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);