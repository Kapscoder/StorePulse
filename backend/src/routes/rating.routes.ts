import { Router } from 'express';
import * as ratingController from '../controllers/rating.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateRating, validateRatingUpdate } from '../middleware/validators';
import { handleValidation } from '../middleware/handleValidation';

const router = Router();

// Only normal users can submit/modify ratings
router.post('/', authenticate, requireRole('normal_user'), validateRating, handleValidation, ratingController.submitRating);
router.put('/:storeId', authenticate, requireRole('normal_user'), validateRatingUpdate, handleValidation, ratingController.updateRating);

export default router;
