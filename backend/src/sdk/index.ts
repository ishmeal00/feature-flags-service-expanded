export function init({ baseUrl, projectKey }: { baseUrl: string; projectKey: string }) {
  async function isEnabled(flagKey: string, userId: string, attrs: Record<string, any> = {}) {
    const params = new URLSearchParams({ projectKey, flagKey, userId, attrs: JSON.stringify(attrs) });
    const res = await fetch(`${baseUrl}/api/evaluate?${params.toString()}`);
    if (!res.ok) throw new Error('Evaluate failed');
    const data = await res.json();
    return data.value as boolean;
  }
  return { isEnabled };
}
