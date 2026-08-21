import express from 'express';
import { handleDeleteReview, handleGetReview, handlePostReview } from '../controllers/review.js';
import { validateBody } from '../middlewares/validate.js';
import { buyerOnly } from '../middlewares/authorization.js';
import { reviewSchema } from '../schema/review.schema.js';

const router = express.Router();

// Public - anyone can read reviews
router.get('/product/:productId', handleGetReview);
// Buyers only - auth checked before body validation
router.post('/product/:productId', buyerOnly, validateBody(reviewSchema), handlePostReview);
router.delete('/:reviewId', buyerOnly, handleDeleteReview);

export default router;