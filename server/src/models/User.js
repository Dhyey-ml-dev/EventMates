import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['student', 'organizer', 'admin'],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDocumentUrl: {
      type: String,
      default: null,
    },
    // Student specific fields
    college: {
      type: String,
      default: null,
    },
    skills: [
      {
        type: String,
      },
    ],
    experience: {
      type: String,
      default: null,
    },
    studentRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    studentReviewCount: {
      type: Number,
      default: 0,
    },
    // Organizer specific fields
    companyName: {
      type: String,
      default: null,
    },
    companyDescription: {
      type: String,
      default: null,
    },
    companyWebsite: {
      type: String,
      default: null,
    },
    organizerRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    organizerReviewCount: {
      type: Number,
      default: 0,
    },
    profileCompletionPercentage: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to remove sensitive data
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model('User', userSchema);
export default User;
