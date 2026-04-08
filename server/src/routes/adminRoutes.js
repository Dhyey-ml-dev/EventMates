import express from 'express';
import { protect, authorize } from '../middlewares/auth.js';
import {
  adminLogin,
  getDashboardStats,
  getAllEventsAdmin,
  createEventAdmin,
  updateEventAdmin,
  deleteEventAdmin,
  getAllVolunteersAdmin,
  verifyVolunteer,
  removeVolunteer,
  getAllUsersAdmin,
  blockUser,
  resetUserPassword,
  getPaymentsAdmin,
  processRefund,
  sendBroadcastMessage,
  getActivityLogs,
  getSystemSettings,
  updateSystemSettings,
} from '../controllers/adminController.js';

const router = express.Router();

// ====== AUTHENTICATION (No protection required) ======
router.post('/login', adminLogin);

// ====== ALL ROUTES BELOW REQUIRE ADMIN AUTHENTICATION ======
router.use(protect);
router.use(authorize('admin'));

// ====== DASHBOARD ======
router.get('/dashboard/stats', getDashboardStats);

// ====== EVENT MANAGEMENT ======
router.get('/events', getAllEventsAdmin);
router.post('/events/create', createEventAdmin);
router.patch('/events/:eventId/update', updateEventAdmin);
router.delete('/events/:eventId/delete', deleteEventAdmin);

// ====== VOLUNTEER MANAGEMENT ======
router.get('/volunteers', getAllVolunteersAdmin);
router.patch('/volunteers/:volunteerId/verify', verifyVolunteer);
router.delete('/volunteers/:volunteerId/remove', removeVolunteer);

// ====== USER MANAGEMENT ======
router.get('/users', getAllUsersAdmin);
router.patch('/users/:userId/block', blockUser);
router.patch('/users/:userId/reset-password', resetUserPassword);

// ====== PAYMENTS ======
router.get('/payments', getPaymentsAdmin);
router.post('/payments/:paymentId/refund', processRefund);

// ====== NOTIFICATIONS & BROADCAST ======
router.post('/broadcast', sendBroadcastMessage);

// ====== ACTIVITY LOGS ======
router.get('/logs', getActivityLogs);

// ====== SETTINGS ======
router.get('/settings', getSystemSettings);
router.patch('/settings/update', updateSystemSettings);

export default router;
