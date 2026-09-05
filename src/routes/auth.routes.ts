import { Router } from 'express';
import { authController } from '@/controllers/auth.controller.js';
import { authLimiter } from '@/middlewares/rateLimit.middleware.js';

const authRoutes = Router();

authRoutes.post('/register', authLimiter, authController.register);
authRoutes.post('/login', authLimiter, authController.login);
authRoutes.post('/logout', authController.logout);

export default authRoutes;
