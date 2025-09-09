import { csrfProtection } from '../app';
import { requireApiKey } from '../middleware/auth';
import { requireAuth } from '../middleware/auth_jwt';
import express from 'express';
import { createProject, listProjects, getProjectByKey } from '../repositories/pg.repository';
import { z } from 'zod';

const router = express.Router();

const createProjectSchema = z.object({ name: z.string().min(1), key: z.string().min(1) });

router.post('/', csrfProtection, requireAuth, async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  try {
    const p = await createProject(parsed.data);
    res.status(201).json(p);
  } catch (err: any) {
    if (err?.code === '23505') return res.status(409).json({ error: 'project_key_exists' });
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

router.get('/', async (_req, res) => {
  const rows = await listProjects();
  res.json(rows);
});

export default router;
