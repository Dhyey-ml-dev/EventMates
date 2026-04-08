import { Router } from 'express';
import { updateProfile, uploadProfilePhoto, getUserProfile, getAllUsers } from '../controllers/userController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = Router();

router.put('/profile', protect, updateProfile);
router.post('/profile-photo', protect, uploadProfilePhoto);
router.get('/profile/:userId', getUserProfile);
router.get('/', protect, authorize('admin'), getAllUsers);

export default router;
