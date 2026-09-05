import { dashboardService } from '@/services/dashboard.service.js';
import type { Request, Response } from 'express';

async function getSummary(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: 'Não autenticado' });
      return;
    }

    const summary = await dashboardService.getSummary(userId);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
}

export const dashboardController = {
  getSummary,
};
