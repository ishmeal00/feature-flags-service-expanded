import { csrfProtection } from '../app';
import { query } from '../db';
import express from 'express';
import { z } from 'zod';
import { createFlag, listFlagsByProject, getFlagById, updateFlag, getFlagByKey, createRule } from '../repositories/pg.repository';

const router = express.Router();

const createFlagSchema = z.object({
  key: z.string().min(1),
  description: z.string().optional(),
  enabled: z.boolean().default(false),
  rollout_pct: z.number().min(0).max(100).default(100),
  rules: z.array(z.object({
    attribute: z.string().min(1),
    op: z.string(),
    value: z.string()
  })).optional()
});

router.post('/projects/:projectId/flags', csrfProtection, async (req, res) => {
  const { projectId } = req.params;
  const parsed = createFlagSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  try {
    // create flag
    const flag = await createFlag(projectId, parsed.data);
    // create rules if any
    if (parsed.data.rules) {
      for (const r of parsed.data.rules) {
        await createRule(flag.id as string, r);
      }
    }
    res.status(201).json(flag);
  } catch (err: any) {
    if (err?.code === '23505') return res.status(409).json({ error: 'flag_key_exists' });
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

router.get('/projects/:projectId/flags', async (req, res) => {
  const { projectId } = req.params;
  const flags = await listFlagsByProject(projectId);
  res.json(flags);
});

router.put('/flags/:flagId', csrfProtection, async (req, res) => {
  const { flagId } = req.params;
  const parsed = createFlagSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  try {
    const updated = await updateFlag(flagId, parsed.data);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server_error' });
  }
});

export default router;


// Delete flag
router.delete('/flags/:flagId', csrfProtection, async (req, res) => {
  const { flagId } = req.params;
  try {
    await query('DELETE FROM flags WHERE id=$1', [flagId]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});

// Delete rule
router.delete('/rules/:ruleId', csrfProtection, async (req, res) => {
  const { ruleId } = req.params;
  try {
    await query('DELETE FROM flag_rules WHERE id=$1', [ruleId]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'server_error' });
  }
});
