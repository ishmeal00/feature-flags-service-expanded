import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import morgan from 'morgan';
import routes from './routes';
import { defaultRateLimiter } from './middleware/rateLimit';

const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
// CSRF protection: apply csurf to state-changing routes via router-level middleware where needed
// create a csurf instance to use in controllers
export const csrfProtection = csurf({ cookie: true });
app.use((req, res, next) => { res.setHeader('Cross-Origin-Resource-Policy','cross-origin'); next(); });
app.use(morgan('combined'));

app.use(defaultRateLimiter);
app.use('/api', routes);

app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
