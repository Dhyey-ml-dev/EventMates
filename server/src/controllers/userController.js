import User from '../models/User.js';
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
  // Student fields
  college: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  // Organizer fields
  companyName: z.string().optional(),
  companyDescription: z.string().optional(),
  companyWebsite: z.string().url().optional(),
});

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, phoneNumber, college, skills, experience, companyName, companyDescription, companyWebsite } =
      req.body;

    // Validate input
    updateProfileSchema.parse(req.body);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        phoneNumber,
        college,
        skills,
        experience,
        companyName,
        companyDescription,
        companyWebsite,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update profile completion percentage
    user.profileCompletionPercentage = calculateProfileCompletion(user);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // In production, upload to Cloudinary
    // For now, just store the file path
    const photoUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(userId, { profilePhoto: photoUrl }, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Profile photo updated',
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error('Upload profile photo error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload profile photo',
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
    });
  }
};

const calculateProfileCompletion = (user) => {
  let completedFields = 0;
  let totalFields = 5; // Basic fields: firstName, lastName, phoneNumber, role

  if (user.firstName) completedFields++;
  if (user.lastName) completedFields++;
  if (user.phoneNumber) completedFields++;
  if (user.profilePhoto) completedFields++;

  if (user.role === 'student') {
    totalFields += 3; // college, skills, experience
    if (user.college) completedFields++;
    if (user.skills && user.skills.length > 0) completedFields++;
    if (user.experience) completedFields++;
  } else if (user.role === 'organizer') {
    totalFields += 3; // companyName, companyDescription, companyWebsite
    if (user.companyName) completedFields++;
    if (user.companyDescription) completedFields++;
    if (user.companyWebsite) completedFields++;
  }

  return Math.round((completedFields / totalFields) * 100);
};

export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query;

    let query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const users = await User.find(query).skip(skip).limit(parseInt(limit));

    const total = await User.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        users: users.map((u) => u.toJSON()),
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get all users error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

export default {
  updateProfile,
  uploadProfilePhoto,
  getUserProfile,
  getAllUsers,
};
