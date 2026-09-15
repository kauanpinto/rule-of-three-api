import { ZodError } from 'zod';
import { AppError } from '@/errors/AppError.js';
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
    } else if (error instanceof AppError) {
      res.status(error.status).json({ message: error.message });
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
    } else if (error instanceof AppError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

async function logout(_req: Request, res: Response) {
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
    } else if (error instanceof AppError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

async function forgotPassword(req: Request, res: Response) {
  try {
    const validatedData = authSchema.forgotPasswordSchema.parse(req.body);
    await authService.forgotPassword(validatedData);

    res.status(200).json({ message: 'Se o email existir, você receberá um link de redefinição' });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Erro de validação', issues: error.issues });
    } else {
      res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
}

async function resetPassword(req: Request, res: Response) {
  try {
    const token = req.query.token;

    if (typeof token !== 'string') return res.status(400).json({ message: 'Token inválido' });
    if (!token) return res.status(404).json({ message: 'Token inválido' });

    const validatedData = authSchema.resetPasswordSchema.parse(req.body);
    await authService.resetPassword(token, validatedData);

    res.status(200).json({ message: 'Senha redefinida com sucesso' });
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

export const authController = {
  register,
  login,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
};
