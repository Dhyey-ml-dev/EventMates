import { z } from 'zod';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendEmail } from '../config/email.js';

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  role: z.enum(['student', 'organizer']),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password is required'),
});

export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Validate input
    signupSchema.parse({ email, password, firstName, lastName, role });

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered. Please login.',
      });
    }

    // Create new user
    const newUser = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      role,
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser._id, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id, newUser.role);

    // Send welcome email
    await sendEmail(
      email,
      'Welcome to EventMates!',
      `<h1>Welcome ${firstName}!</h1><p>Your account has been created successfully. Start exploring events now!</p>`
    ).catch((err) => console.log('Email sending failed:', err.message));

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: newUser.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Signup failed',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    loginSchema.parse({ email, password });

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if account is suspended
    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Contact support.',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Token refresh failed',
    });
  }
};

export const logout = async (req, res) => {
  try {
    // In a real app, you might want to add the token to a blacklist
    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
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
    console.error('Get current user error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
    });
  }
};

export default {
  signup,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
};
