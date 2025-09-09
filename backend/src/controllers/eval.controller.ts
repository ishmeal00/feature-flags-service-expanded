import { query } from '../db';
import express from 'express';
import { getProjectByKey, getFlagByKey } from '../repositories/pg.repository';
import { evaluateFlag } from '../services/evaluate.service';

const router = express.Router();

router.get('/evaluate', async (req, res) => {
  const { projectKey, flagKey, userId } = req.query as Record<string,string>;
  const attrsParam = (req.query.attrs as string) || '{}';
  if (!projectKey || !flagKey || !userId) return res.status(400).json({ error: 'missing_params' });
  const project = await getProjectByKey(projectKey);
  if (!project) return res.status(404).json({ error: 'project_not_found' });
  const flag = await getFlagByKey(project.id as string, flagKey);
  if (!flag) return res.status(404).json({ error: 'flag_not_found' });
  let attrs: Record<string, any> = {};
  try { attrs = JSON.parse(attrsParam); } catch {}
  const result = await evaluateFlag(flag, userId, attrs);
  try {
    await query('INSERT INTO exposures(flag_id, user_id, result, user_pct) VALUES($1,$2,$3,$4)', [flag.id, userId, result.value, result.userPct || null]);
  } catch(e) { console.warn('exposure log failed', e); }

  
// ATTEMPT: increment metering usage if subscription exists for project owner (placeholder logic)
try {
  // This is placeholder; for production you'd link projects to subscription/customer
  const subRes = await query('SELECT id FROM subscriptions LIMIT 1'); // simplistic
  const sub = subRes.rows[0];
  if (sub) {
    await query('INSERT INTO plan_usage(subscription_id, period, evaluations) VALUES($1,$2,$3) ON CONFLICT (subscription_id, period) DO UPDATE SET evaluations = plan_usage.evaluations + 1', [sub.id, new Date().toISOString().slice(0,10), 1]);
  }
} catch(e) { console.warn('metering failed', e); }

  res.json({ flagKey, projectKey, ...result });
});

export default router;
