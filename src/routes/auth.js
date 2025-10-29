import { Router } from 'express';
import { login,updateFcmToken } from '../controllers/authController.js';
import { loginValidation, registerValidation } from '../validators/authValidator.js';
import validateRequest from '../middlewares/validateRequests.js';
import { authMiddleware } from '../middlewares/auth.midleware.js';
import { requestOtp, resetPassword, verifyOtp } from '../controllers/passwordrset.controller.js';

const router = Router();

router.post('/login', loginValidation, validateRequest, login);
router.post("/update-fcm-token", authMiddleware, updateFcmToken);

router.post("/forgot-password", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
export default router;