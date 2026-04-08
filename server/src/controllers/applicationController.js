import Application from '../models/Application.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const applyToEvent = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { eventId } = req.params;
    const { applicationMessage } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ studentId, eventId });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this event',
      });
    }

    // Check applicant limit
    if (event.applicants.length >= event.maxApplicants) {
      return res.status(400).json({
        success: false,
        message: 'This event has reached maximum applicants',
      });
    }

    // Create application
    const application = await Application.create({
      studentId,
      eventId,
      organizerId: event.organizerId,
      applicationMessage,
    });

    // Add student to event applicants
    event.applicants.push({ studentId });
    await event.save();

    // Create notification for organizer
    await Notification.create({
      userId: event.organizerId,
      type: 'application',
      title: 'New Application',
      description: `A student has applied to your event: ${event.title}`,
      relatedId: eventId,
    });

    return res.status(201).json({
      success: true,
      message: 'Applied to event successfully',
      data: {
        application,
      },
    });
  } catch (error) {
    console.error('Apply to event error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to apply to event',
    });
  }
};

export const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { page = 1, limit = 10, status } = req.query;

    let query = { studentId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const applications = await Application.find(query)
      .populate('eventId')
      .populate('organizerId', 'firstName lastName companyName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Application.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get student applications error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
    });
  }
};

export const getEventApplications = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const { eventId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    // Check if event belongs to organizer
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.organizerId.toString() !== organizerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view these applications',
      });
    }

    let query = { eventId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const applications = await Application.find(query)
      .populate('studentId', 'firstName lastName college skills profilePhoto studentRating')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Application.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get event applications error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const organizerId = req.user.userId;
    const { applicationId } = req.params;
    const { status, rejectionReason } = req.body;

    const application = await Application.findById(applicationId).populate('studentId');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if organizer owns the event
    if (application.organizerId.toString() !== organizerId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this application',
      });
    }

    // Update status
    const previousStatus = application.status;
    application.status = status;

    if (status === 'rejected') {
      application.rejectionReason = rejectionReason;
    }

    if (status === 'shortlisted') {
      application.shortlistedDate = new Date();
    } else if (status === 'selected') {
      application.selectedDate = new Date();
    } else if (status === 'completed') {
      application.completedDate = new Date();
    }

    await application.save();

    // Create notification for student
    const statusMessages = {
      shortlisted: 'You have been shortlisted!',
      selected: 'Congratulations! You have been selected.',
      rejected: 'Your application has been rejected.',
      completed: 'The event has been completed.',
    };

    await Notification.create({
      userId: application.studentId._id,
      type: 'selection',
      title: `Application ${status}`,
      description: statusMessages[status] || `Your application status: ${status}`,
      relatedId: application.eventId,
    });

    return res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: {
        application,
      },
    });
  } catch (error) {
    console.error('Update application status error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update application',
    });
  }
};

export const cancelApplication = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if student owns the application
    if (application.studentId.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this application',
      });
    }

    // Check if can still cancel (not selected or completed)
    if (['selected', 'completed'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this application',
      });
    }

    application.status = 'cancelled';
    await application.save();

    return res.status(200).json({
      success: true,
      message: 'Application cancelled successfully',
      data: {
        application,
      },
    });
  } catch (error) {
    console.error('Cancel application error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel application',
    });
  }
};

export default {
  applyToEvent,
  getStudentApplications,
  getEventApplications,
  updateApplicationStatus,
  cancelApplication,
};
