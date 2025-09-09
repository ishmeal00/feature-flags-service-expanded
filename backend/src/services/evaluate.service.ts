import cache from '../cache/redis';
import crypto from 'crypto';
import { compare } from '../utils/validators';
import { getRulesForFlag } from '../repositories/pg.repository';

// deterministic bucketing per userId+flagKey -> 0..100 (two decimals)
export function stablePercent(userId: string, flagKey: string): number {
  const h = crypto.createHash('sha1').update(userId + '::' + flagKey).digest('hex');
  const n = parseInt(h.slice(0, 8), 16);
  return (n % 10000) / 100;
}

export async function evaluateFlag(flag: any, userId: string, attrs: Record<string, any>) {
  if (!flag) return { value: false, reason: 'flag_not_found' };
  if (!flag.enabled) return { value: false, reason: 'disabled' };

  const cacheKey = `flag_rules:${flag.id}`;
  let rules = [];
  try {
    if (cache) {
      const raw = await cache.get(cacheKey);
      if (raw) rules = JSON.parse(raw);
    }
  } catch (e) { console.warn('redis error', e); }

  if (!rules || rules.length === 0) {
    rules = await getRulesForFlag(flag.id);
    try { if (cache) await cache.set(cacheKey, JSON.stringify(rules), 'EX', 60); } catch {}
  }

  const matchesRules = (rules.length === 0) || rules.every(r => compare(r.op as any, attrs[r.attribute], r.value));
  if (!matchesRules) return { value: false, reason: 'rules_miss' };

  const pct = flag.rollout_pct ?? 100;
  if (pct >= 100) return { value: true, reason: 'full_rollout' };
  if (pct <= 0) return { value: false, reason: 'zero_rollout' };

  const userPct = stablePercent(userId, flag.key);
  const result = userPct < pct;
  return { value: result, reason: 'percent', userPct };
}
