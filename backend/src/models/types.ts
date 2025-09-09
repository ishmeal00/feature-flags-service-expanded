export type UUID = string;

export type Operator = 'equals' | 'not_equals' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte';

export interface TargetRule {
  id?: UUID;
  flagId?: UUID;
  attribute: string;
  op: Operator;
  value: string;
}

export interface Flag {
  id?: UUID;
  projectId: UUID;
  key: string;
  description?: string;
  enabled: boolean;
  rollout_pct: number;
  updated_at?: string;
}

export interface Project {
  id?: UUID;
  key: string;
  name: string;
  created_at?: string;
}
