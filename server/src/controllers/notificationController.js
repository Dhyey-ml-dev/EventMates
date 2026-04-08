import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, isRead } = req.query;

    let query = { userId };
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const skip = (page - 1) * limit;
    const notifications = await Notification.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    if (notification.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this notification',
      });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: {
        notification,
      },
    });
  } catch (error) {
    console.error('Mark notification error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification',
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Mark all notifications error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update notifications',
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { notificationId } = req.params;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    if (notification.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this notification',
      });
    }

    await Notification.findByIdAndDelete(notificationId);

    return res.status(200).json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error('Delete notification error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
    });
  }
};

export default {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
