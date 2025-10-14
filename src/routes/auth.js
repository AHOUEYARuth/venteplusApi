import { Router } from 'express';
import upload from '../middlewares/upload.js';
import { register, login } from '../controllers/authController.js';
import { loginValidation, registerValidation } from '../validators/authValidator.js';
import validateRequest from '../middlewares/validateRequests.js';

const router = Router();

router.post('/register', upload.single('avatar'), registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);

export default router;