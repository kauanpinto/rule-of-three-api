import { Router } from 'express';
import { authController } from '@/controllers/auth.controller.js';
import { authLimiter, accountActionLimiter } from '@/middlewares/rateLimit.middleware.js';
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

export default authRoutes;
