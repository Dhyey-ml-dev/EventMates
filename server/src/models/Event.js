import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    eventEndDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    roles: [
      {
        title: String,
        count: Number,
        description: String,
      },
    ],
    pay: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'INR',
      },
      paymentType: {
        type: String,
        enum: ['hourly', 'fixed'],
        default: 'fixed',
      },
    },
    maxApplicants: {
      type: Number,
      default: 50,
    },
    applicants: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        appliedDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    selectedCandidates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
      default: 'draft',
    },
    eventImage: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
    requirements: [String],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isSample: {
      type: Boolean,
      default: false,
    },
    createdByRole: {
      type: String,
      enum: ['admin', 'organizer'],
      default: 'organizer',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'free'],
      default: 'pending',
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
eventSchema.index({ title: 'text', description: 'text', location: 'text' });
eventSchema.index({ organizerId: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ eventDate: 1 });

export const Event = mongoose.model('Event', eventSchema);
export default Event;
