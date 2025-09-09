export type Operator = 'equals'|'not_equals'|'contains'|'gt'|'gte'|'lt'|'lte';

export function compare(op: Operator, a: any, b: any): boolean {
  switch (op) {
    case 'equals': return String(a) === String(b);
    case 'not_equals': return String(a) !== String(b);
    case 'contains': return (Array.isArray(a) && a.includes(b)) || (String(a).includes(String(b)));
    case 'gt': return Number(a) > Number(b);
    case 'gte': return Number(a) >= Number(b);
    case 'lt': return Number(a) < Number(b);
    case 'lte': return Number(a) <= Number(b);
    default: return false;
  }
}
