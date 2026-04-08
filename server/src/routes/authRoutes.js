import { Router } from 'express';
import { signup, login, refreshAccessToken, logout, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/signup', loginLimiter, signup);
router.post('/login', loginLimiter, login);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentUser);

export default router;
