import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'Token inválido' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
    return;
  }
}
