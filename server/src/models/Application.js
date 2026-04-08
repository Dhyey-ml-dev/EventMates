import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'selected', 'rejected', 'completed', 'cancelled'],
      default: 'applied',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    shortlistedDate: {
      type: Date,
      default: null,
    },
    selectedDate: {
      type: Date,
      default: null,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    applicationMessage: {
      type: String,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    attendanceStatus: {
      type: String,
      enum: ['pending', 'present', 'absent'],
      default: 'pending',
    },
    hoursWorked: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
applicationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });
applicationSchema.index({ eventId: 1 });
applicationSchema.index({ studentId: 1 });
applicationSchema.index({ status: 1 });

export const Application = mongoose.model('Application', applicationSchema);
export default Application;
