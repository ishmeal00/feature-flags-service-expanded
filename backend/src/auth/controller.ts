import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, verifyPassword } from './repo';
import { z } from 'zod';
import { query } from '../db';

const router = express.Router();
const registerSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

// Simple register (for admin bootstrap)
router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  try {
    const existing = await findUserByEmail(parsed.data.email);
    if (existing) return res.status(409).json({ error: 'user_exists' });
    const user = await createUser(parsed.data.email, parsed.data.password, 'admin');
    res.status(201).json({ id: user.id, email: user.email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

// Login -> JWT (no refresh tokens in Community)
router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const user = await findUserByEmail(parsed.data.email);
  if (!user) return res.status(401).json({ error: 'invalid_credentials' });
  const ok = await verifyPassword(user, parsed.data.password);
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
  const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '12h' });
  await query('INSERT INTO exposures(flag_id, user_id, result, user_pct) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING', [null, user.id, false, null]).catch(()=>{}); // noop, just placeholder
  res.json({ token });
});

export default router;
