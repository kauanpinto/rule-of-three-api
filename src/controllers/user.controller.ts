import { ZodError } from 'zod';
import { AppError } from '@/errors/AppError.js';
import { userService } from '@/services/user.service.js';
import { userSchema } from '@/schemas/user.schema.js';
import type { Request, Response } from 'express';

async function updateProfile(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const validatedData = userSchema.updateProfileSchema.parse(req.body);
    const updatedUser = await userService.updateProfile(userId, validatedData);

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Erro de validação', issues: error.issues });
    } else if (error instanceof AppError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

async function deleteAccount(req: Request, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    const validatedData = userSchema.deleteAccountSchema.parse(req.body);
    await userService.deleteAccount(userId, validatedData);

    res.status(200).json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Erro de validação', issues: error.issues });
    } else if (error instanceof AppError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

export const userController = {
  updateProfile,
  deleteAccount,
};
