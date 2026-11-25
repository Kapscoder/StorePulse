import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateRegister, validateLogin, validateChangePassword } from '../middleware/validators';
import { handleValidation } from '../middleware/handleValidation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validateRegister, handleValidation, authController.register);
router.post('/login', validateLogin, handleValidation, authController.login);
router.post('/change-password', authenticate, validateChangePassword, handleValidation, authController.changePassword);
router.get('/me', authenticate, authController.getMe);

export default router;
