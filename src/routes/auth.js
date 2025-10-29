import { Router } from 'express';
import { login,updateFcmToken } from '../controllers/authController.js';
import { loginValidation, registerValidation } from '../validators/authValidator.js';
import validateRequest from '../middlewares/validateRequests.js';
import { authMiddleware } from '../middlewares/auth.midleware.js';

const router = Router();

router.post('/login', loginValidation, validateRequest, login);
router.post("/update-fcm-token", authMiddleware, updateFcmToken);
export default router;