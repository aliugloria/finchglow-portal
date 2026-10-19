import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { searchPortal } from '@/lib/search';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

async function search(query: string, company: Parameters<typeof searchPortal>[1] = 'group') {
  const pending = searchPortal(query, company, 'contact-centre-agent');
  await vi.advanceTimersByTimeAsync(600); // skip the simulated network delay
  return pending;
}

describe('searchPortal', () => {
  it('finds matches across alerts and news, ignoring case', async () => {
    const results = await search('FLIGHT');
    expect(results.alerts.map((a) => a.id)).toContain('a2');
  });

  it('requires every word to match', async () => {
    expect((await search('flight delay')).alerts).toHaveLength(1);
    expect((await search('flight banana')).alerts).toHaveLength(0);
  });

  it('returns nothing for an unknown term', async () => {
    const r = await search('passport');
    expect(r.apps.length + r.news.length + r.alerts.length).toBe(0);
  });

  it('respects the selected business', async () => {
    expect((await search('flight', 'group')).alerts).toHaveLength(1);
    expect((await search('flight', 'holidays')).alerts).toHaveLength(0);
  });

  it('only searches apps the role can use', async () => {
    const pending = searchPortal('crm', 'group', 'facilities-technician');
    await vi.advanceTimersByTimeAsync(600);
    expect((await pending).apps).toHaveLength(0);
  });
});
