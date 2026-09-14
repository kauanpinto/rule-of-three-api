import { rateLimit } from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { message: 'Muitas tentativas. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
});

export const accountActionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: 'Muitas tentativas. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
});

export const publicSensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: { message: 'Muitas tenativas. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
});
