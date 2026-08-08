const Event = require('../models/Event');

// Required services based on event type
const getRequiredServices = (eventType) => {
  const services = {
    Wedding: ['Venue', 'Catering', 'Decoration', 'Photography', 'Videography', 'Entertainment', 'Sound & Lighting'],
    Birthday: ['Venue', 'Catering', 'Decoration', 'Photography', 'Entertainment'],
    Corporate: ['Venue', 'Catering', 'Sound & Lighting', 'Photography'],
    Conference: ['Venue', 'Sound & Lighting', 'Catering'],
    Anniversary: ['Venue', 'Catering', 'Decoration', 'Photography'],
    'Social Gathering': ['Venue', 'Catering', 'Decoration'],
    Other: ['Venue', 'Catering']
  };
  return services[eventType] || ['Venue', 'Catering'];
};

const getOptionalServices = (eventType) => {
  const allCategories = ['Venue', 'Catering', 'Decoration', 'Photography', 'Videography', 'Entertainment', 'Sound & Lighting'];
  const required = getRequiredServices(eventType);
  return allCategories.filter(service => !required.includes(service));
};

// @desc Create event
// @route POST /api/events
const createEvent = async (req, res) => {
  try {
    const { eventName, eventType, date, city, guestCount, budget, description } = req.body;
    const requiredServices = getRequiredServices(eventType);
    const optionalServices = getOptionalServices(eventType);

    const event = await Event.create({
      user: req.user._id,
      eventName, eventType, date, city,
      guestCount, budget, description,
      requiredServices,
      optionalServices
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc Get all events for logged in user
// @route GET /api/events
const getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single event
// @route GET /api/events/:id
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('selectedVendors.vendor');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get recommended vendors for an event's pending services
// @route GET /api/events/:id/recommendations
const getRecommendations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const Vendor = require('../models/Vendor');
    const allServices = [...event.requiredServices, ...(event.optionalServices || [])];
    const bookedServices = event.selectedVendors.map(v => v.service);
    const pendingServices = allServices.filter(s => !bookedServices.includes(s));

    const recommendations = {};

    for (const service of pendingServices) {
      const vendors = await Vendor.find({
        category: service,
        location: { $regex: event.city, $options: 'i' },
        isVerified: true,
        isSuspended: false
      }).sort({ rating: -1 }).limit(3);

      if (vendors.length > 0) {
        recommendations[service] = vendors;
      } else {
        const fallbackVendors = await Vendor.find({
          category: service,
          isVerified: true,
          isSuspended: false
        }).sort({ rating: -1 }).limit(3);
        recommendations[service] = fallbackVendors;
      }
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update event
// @route PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete event
// @route DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add vendor to event package
// @route POST /api/events/:id/vendors
const addVendorToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const { service, vendor, packageName, price } = req.body;
    event.selectedVendors.push({ service, vendor, packageName, price });

    // Update total spent
    event.totalSpent = event.selectedVendors.reduce((acc, v) => acc + (v.price || 0), 0);

    // Update readiness
    const completed = event.selectedVendors.length;
    const total = event.requiredServices.length;
    event.readinessPercentage = Math.round((completed / total) * 100);

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createEvent, getUserEvents, getEventById, updateEvent, deleteEvent, addVendorToEvent, getRecommendations };