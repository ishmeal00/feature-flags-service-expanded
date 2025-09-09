import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function requireAuth(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const auth = req.header('authorization');
  if (!auth) return res.status(401).json({ error: 'missing_authorization' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'invalid_authorization' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret') as any;
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

export function requireRole(role: string) {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'not_authenticated' });
    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'forbidden' });
    next();
  };
}
