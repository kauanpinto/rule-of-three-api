import { ZodError } from 'zod';
import { authService } from '@/services/auth.service.js';
import { authSchema } from '@/schemas/auth.schema.js';
import type { Request, Response } from 'express';

async function register(req: Request, res: Response) {
  try {
    const validatedData = authSchema.registerSchema.parse(req.body);
    const newUser = await authService.registerUser(validatedData);

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Erro de validação', issues: error.issues });
    } else if (error instanceof Error) {
      res.status(409).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

async function login(req: Request, res: Response) {
  try {
    const validatedData = authSchema.loginSchema.parse(req.body);
    const token = await authService.loginUser(validatedData);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: 'Login realizado com sucesso' });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Erro de validação', issues: error.issues });
    } else if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

async function logout(req: Request, res: Response) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logout realizado com sucesso' });
}

async function changePassword(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Não autenticado' });

    const validatedData = authSchema.changePasswordSchema.parse(req.body);
    await authService.changePassword(userId, validatedData);

    res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Erro de validação', issues: error.issues });
    } else if (error instanceof Error && error.message === 'INVALID_CURRENT_PASSWORD') {
      res.status(401).json({ message: 'Senha atual incorreta' });
    } else if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
      res.status(404).json({ message: 'Usuário não encontrado' });
    } else if (error instanceof Error && error.message === 'SAME_PASSWORD') {
      res.status(400).json({ message: 'A nova senha não pode ser igual à atual' });
    } else {
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

export const authController = {
  register,
  login,
  logout,
  changePassword,
};
