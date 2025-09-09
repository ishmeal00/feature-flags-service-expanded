import { query } from '../db';
import { Project, Flag, TargetRule } from '../models/types';

export async function createProject(p: { key: string; name: string }) {
  const res = await query(
    'INSERT INTO projects(key, name) VALUES($1,$2) RETURNING *',
    [p.key, p.name]
  );
  return res.rows[0] as Project;
}

export async function getProjectByKey(key: string) {
  const res = await query('SELECT * FROM projects WHERE key=$1', [key]);
  return res.rows[0] as Project | undefined;
}

export async function listProjects() {
  const res = await query('SELECT * FROM projects ORDER BY created_at DESC');
  return res.rows as Project[];
}

export async function createFlag(projectId: string, f: Partial<Flag>) {
  const res = await query(
    'INSERT INTO flags(project_id, key, description, enabled, rollout_pct) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [projectId, f.key, f.description || null, f.enabled ?? false, f.rollout_pct ?? 100]
  );
  return res.rows[0] as Flag;
}

export async function listFlagsByProject(projectId: string) {
  const res = await query('SELECT * FROM flags WHERE project_id=$1', [projectId]);
  return res.rows as Flag[];
}

export async function getFlagByKey(projectId: string, key: string) {
  const res = await query('SELECT * FROM flags WHERE project_id=$1 AND key=$2', [projectId, key]);
  return res.rows[0] as Flag | undefined;
}

export async function getFlagById(flagId: string) {
  const res = await query('SELECT * FROM flags WHERE id=$1', [flagId]);
  return res.rows[0] as Flag | undefined;
}

export async function updateFlag(flagId: string, data: Partial<Flag>) {
  const res = await query(
    'UPDATE flags SET description=$1, enabled=$2, rollout_pct=$3, updated_at=now() WHERE id=$4 RETURNING *',
    [data.description || null, data.enabled ?? false, data.rollout_pct ?? 100, flagId]
  );
  return res.rows[0] as Flag;
}

export async function getRulesForFlag(flagId: string) {
  const res = await query('SELECT * FROM flag_rules WHERE flag_id=$1', [flagId]);
  return res.rows as TargetRule[];
}

export async function createRule(flagId: string, rule: Partial<TargetRule>) {
  const res = await query(
    'INSERT INTO flag_rules(flag_id, attribute, op, value) VALUES($1,$2,$3,$4) RETURNING *',
    [flagId, rule.attribute, rule.op, rule.value]
  );
  return res.rows[0] as TargetRule;
}
