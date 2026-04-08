import { Router } from 'express';
import {
  applyToEvent,
  getStudentApplications,
  getEventApplications,
  updateApplicationStatus,
  cancelApplication,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

// Student routes
router.post('/:eventId/apply', protect, authorize('student'), applyToEvent);
router.get('/my-applications', protect, authorize('student'), getStudentApplications);
router.delete('/:applicationId/cancel', protect, authorize('student'), cancelApplication);

// Organizer routes
router.get('/event/:eventId/applicants', protect, authorize('organizer'), getEventApplications);
router.patch('/:applicationId/status', protect, authorize('organizer'), updateApplicationStatus);

export default router;
