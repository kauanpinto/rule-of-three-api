import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import type { Application, Request, Response } from 'express';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.get('/health', (_req: Request, res: Response): void => {
    res.json({ status: 'ok' });
});

export default app;