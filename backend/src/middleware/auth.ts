import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

// Simple API key middleware for admin/management endpoints.
// For public SDK endpoints (evaluate) we currently allow anonymous reads by projectKey.
export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const key = req.header('x-api-key') || req.query.apiKey;
  if (!key) return res.status(401).json({ error: 'missing_api_key' });
  if (key !== config.apiKey) return res.status(403).json({ error: 'invalid_api_key' });
  next();
}
