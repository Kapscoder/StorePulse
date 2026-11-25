import { Router } from 'express';
import * as ownerController from '../controllers/owner.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/dashboard', authenticate, requireRole('store_owner'), ownerController.getOwnerDashboard);

export default router;
