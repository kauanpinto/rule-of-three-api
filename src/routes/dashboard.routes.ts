import { Router } from 'express';
import { requireAuth } from '@/middlewares/auth.middleware.js';
import { dashboardController } from '@/controllers/dashboard.controller.js';

const dashboardRoutes = Router();

dashboardRoutes.get('/summary', requireAuth, dashboardController.getSummary);

export default dashboardRoutes;
