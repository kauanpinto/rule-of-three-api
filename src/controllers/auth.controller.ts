import type { Request, Response } from 'express';
import { ZodError } from 'zod';
import { registerSchema, loginSchema } from '@/schemas/auth.schema';
import { registerUser, loginUser } from '@/services/auth.service';

export async function register(req: Request, res: Response) {
  try {
    const validatedData = registerSchema.parse(req.body);
    const newUser = await registerUser(validatedData);

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

export async function login(req: Request, res: Response) {
  try {
    const validatedData = loginSchema.parse(req.body);
    const token = await loginUser(validatedData);

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

export async function logout(req: Request, res: Response) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logout realizado com sucesso' });
}
