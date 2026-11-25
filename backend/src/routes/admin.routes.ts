import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { validateCreateStore, validateListQuery } from '../middleware/validators';
import { handleValidation } from '../middleware/handleValidation';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireRole('admin'));

router.get('/dashboard', adminController.getDashboard);

// Users
router.get('/users', validateListQuery, handleValidation, adminController.getUsers);
router.post('/users', adminController.createUser);
router.get('/users/:id', adminController.getUserById);

// Stores
router.get('/stores', validateListQuery, handleValidation, adminController.getStores);
router.post('/stores', validateCreateStore, handleValidation, adminController.createStore);
router.get('/stores/:id', adminController.getStoreById);

export default router;
