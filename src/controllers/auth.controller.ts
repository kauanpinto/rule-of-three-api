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

export const authController = {
  register,
  login,
  logout,
};
