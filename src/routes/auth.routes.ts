import { Router } from 'express';
import { authController } from '@/controllers/auth.controller.js';
import {
  authLimiter,
  accountActionLimiter,
  publicSensitiveLimiter,
} from '@/middlewares/rateLimit.middleware.js';
import { requireAuth } from '@/middlewares/auth.middleware.js';

const authRoutes = Router();

authRoutes.post('/register', authLimiter, authController.register);
authRoutes.post('/login', authLimiter, authController.login);
authRoutes.post('/logout', authController.logout);
authRoutes.patch(
  '/change-password',
  requireAuth,
  accountActionLimiter,
  authController.changePassword,
);
authRoutes.post('/forgot-password', publicSensitiveLimiter, authController.forgotPassword);
authRoutes.post('/reset-password', publicSensitiveLimiter, authController.resetPassword);

export default authRoutes;
