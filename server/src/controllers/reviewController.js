import Review from '../models/Review.js';
import User from '../models/User.js';
import Application from '../models/Application.js';

export const createReview = async (req, res) => {
  try {
    const reviewerId = req.user.userId;
    const { targetUserId, eventId, applicationId, rating, title, comment } = req.body;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      reviewerId,
      targetUserId,
      eventId,
      applicationId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this user for this event',
      });
    }

    const userRole = req.user.role;
    const review = await Review.create({
      reviewerId,
      targetUserId,
      eventId,
      applicationId,
      rating,
      title,
      comment,
      reviewerRole: userRole,
    });

    // Update target user's rating
    const reviews = await Review.find({ targetUserId });
    const averageRating = (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1);

    if (userRole === 'student') {
      await User.findByIdAndUpdate(targetUserId, {
        organizerRating: averageRating,
        organizerReviewCount: reviews.length,
      });
    } else {
      await User.findByIdAndUpdate(targetUserId, {
        studentRating: averageRating,
        studentReviewCount: reviews.length,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: {
        review,
      },
    });
  } catch (error) {
    console.error('Create review error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create review',
    });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;
    const reviews = await Review.find({ targetUserId: userId })
      .populate('reviewerId', 'firstName lastName profilePhoto')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({ targetUserId: userId });

    return res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get user reviews error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if user is the reviewer
    if (review.reviewerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this review',
      });
    }

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete review',
    });
  }
};

export default {
  createReview,
  getUserReviews,
  deleteReview,
};
