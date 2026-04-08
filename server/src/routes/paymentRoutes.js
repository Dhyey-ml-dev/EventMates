import { Router } from 'express';
import {
  initiatePayment,
  verifyPayment,
  getPaymentHistory,
  refundPayment,
  initiateEventPostingPayment,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.post('/initiate', protect, authorize('organizer'), initiatePayment);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, authorize('organizer'), getPaymentHistory);
router.post('/:paymentId/refund', protect, authorize('organizer'), refundPayment);

// Event posting payment route
router.post('/events/initiate-event-posting', protect, authorize('organizer'), initiateEventPostingPayment);

export default router;
