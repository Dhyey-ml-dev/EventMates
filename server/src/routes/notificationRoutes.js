import { Router } from 'express';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.get('/', protect, getNotifications);
router.patch('/:notificationId/read', protect, markNotificationAsRead);
router.patch('/read-all', protect, markAllNotificationsAsRead);
router.delete('/:notificationId', protect, deleteNotification);

export default router;
