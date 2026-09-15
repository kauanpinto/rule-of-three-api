import { ZodError } from 'zod';
import { userService } from '@/services/user.service.js';
import { userSchema } from '@/schemas/user.schema.js';
import type { Request, Response } from 'express';

async function deleteAccount(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Não autenticado' });

    const validatedData = userSchema.deleteAccountSchema.parse(req.body);
    await userService.deleteAccount(userId, validatedData);

    res.status(200).json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Erro de validação', issues: error.issues });
    } else if (error instanceof Error && error.message === 'INVALID_CURRENT_PASSWORD') {
      res.status(401).json({ message: 'Senha atual incorreta' });
    } else if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ message: 'Usuário não encontrado' });
    } else {
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

export const userController = {
  deleteAccount,
};
