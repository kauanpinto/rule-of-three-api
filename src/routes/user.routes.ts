import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware.js';
import { userController } from '@/controllers/user.controller.js';
import { accountActionLimiter } from '@/middlewares/rateLimit.middleware.js';

const userRoutes = Router();

userRoutes.delete('/me', requireAuth, accountActionLimiter, userController.deleteAccount);

export default userRoutes;
