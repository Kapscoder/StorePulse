import { Router } from 'express';
import * as storeController from '../controllers/store.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateListQuery } from '../middleware/validators';
import { handleValidation } from '../middleware/handleValidation';

const router = Router();

// Normal users (and store owners) can view stores
router.get(
  '/',
  authenticate,
  requireRole('normal_user', 'store_owner', 'admin'),
  validateListQuery,
  handleValidation,
  storeController.getStores
);

export default router;
