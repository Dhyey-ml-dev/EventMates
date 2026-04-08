import { Router } from 'express';
import {
  createEvent,
  updateEvent,
  publishEvent,
  deleteEvent,
  getEventById,
  getAllEvents,
  getOrganizerEvents,
  publishEventAfterPayment,
} from '../controllers/eventController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:eventId', getEventById);

// Protected organizer routes
router.post('/', protect, authorize('organizer', 'admin'), createEvent);
router.put('/:eventId', protect, authorize('organizer'), updateEvent);
router.patch('/:eventId/publish', protect, authorize('organizer'), publishEvent);
router.patch('/:eventId/publish-after-payment', protect, authorize('organizer'), publishEventAfterPayment);
router.delete('/:eventId', protect, authorize('organizer'), deleteEvent);
router.get('/organizer/my-events', protect, authorize('organizer'), getOrganizerEvents);

export default router;
