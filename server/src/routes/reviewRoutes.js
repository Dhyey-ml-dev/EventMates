import { Router } from 'express';
import { createReview, getUserReviews, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.post('/', protect, createReview);
router.get('/user/:userId', getUserReviews);
router.delete('/:reviewId', protect, deleteReview);

export default router;
