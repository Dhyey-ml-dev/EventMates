import Event from '../models/Event.js';
import { z } from 'zod';

const createEventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(3, 'Location is required'),
  eventDate: z.string().datetime(),
  eventEndDate: z.string().datetime(),
  startTime: z.string(),
  endTime: z.string(),
  roles: z.array(
    z.object({
      title: z.string(),
      count: z.number().min(1),
      description: z.string(),
    })
  ),
  pay: z.object({
    amount: z.number().positive('Amount must be positive'),
    paymentType: z.enum(['hourly', 'fixed']),
  }),
  requirements: z.array(z.string()).optional(),
  category: z.string().optional(),
});

export const createEvent = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const userRole = req.user.role;
    const eventData = req.body;

    // Validate input
    createEventSchema.parse(eventData);

    // Admin events bypass payment (status = 'published' immediately)
    // Organizer events require payment (status = 'draft' until payment verified)
    const isAdmin = userRole === 'admin';
    const initialStatus = isAdmin ? 'published' : 'draft';
    const paymentStatus = isAdmin ? 'free' : 'pending';

    const newEvent = await Event.create({
      organizerId,
      ...eventData,
      currency: 'INR',
      status: initialStatus,
      paymentStatus,
      createdByRole: userRole,
    });

    return res.status(201).json({
      success: true,
      message: isAdmin ? 'Event created and published successfully' : 'Event created. Please complete payment to publish.',
      data: {
        event: newEvent,
      },
    });
  } catch (error) {
    console.error('Create event error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event',
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.userId;
    const updateData = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the organizer
    if (event.organizerId.toString() !== organizerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this event',
      });
    }

    // Don't allow updating status directly (use separate endpoints)
    delete updateData.status;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true, runValidators: true });

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: {
        event: updatedEvent,
      },
    });
  } catch (error) {
    console.error('Update event error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update event',
    });
  }
};

export const publishEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the organizer
    if (event.organizerId.toString() !== organizerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to publish this event',
      });
    }

    event.status = 'published';
    await event.save();

    return res.status(200).json({
      success: true,
      message: 'Event published successfully',
      data: {
        event,
      },
    });
  } catch (error) {
    console.error('Publish event error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish event',
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the organizer
    if (event.organizerId.toString() !== organizerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this event',
      });
    }

    await Event.findByIdAndDelete(eventId);

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete event',
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByIdAndUpdate(eventId, { $inc: { viewCount: 1 } }, { new: true }).populate(
      'organizerId',
      'firstName lastName companyName profilePhoto'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        event,
      },
    });
  } catch (error) {
    console.error('Get event by ID error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 12, location, minPay, maxPay, category, status = 'published', search } = req.query;

    let query = { status };

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (minPay || maxPay) {
      query['pay.amount'] = {};
      if (minPay) query['pay.amount'].$gte = parseInt(minPay);
      if (maxPay) query['pay.amount'].$lte = parseInt(maxPay);
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const events = await Event.find(query)
      .populate('organizerId', 'firstName lastName companyName profilePhoto')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Event.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        events,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all events error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
    });
  }
};

export const getOrganizerEvents = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    let query = { organizerId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const events = await Event.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });

    const total = await Event.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        events,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get organizer events error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
    });
  }
};

export const publishEventAfterPayment = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user.userId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the organizer
    if (event.organizerId.toString() !== organizerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to publish this event',
      });
    }

    // Check if payment is completed
    if (event.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed. Please complete payment to publish event.',
      });
    }

    event.status = 'published';
    await event.save();

    return res.status(200).json({
      success: true,
      message: 'Event published successfully after payment verification',
      data: {
        event,
      },
    });
  } catch (error) {
    console.error('Publish event after payment error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish event',
    });
  }
};

export default {
  createEvent,
  updateEvent,
  publishEvent,
  deleteEvent,
  getEventById,
  getAllEvents,
  getOrganizerEvents,
};
