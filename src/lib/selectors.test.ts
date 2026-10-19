import { describe, expect, it } from 'vitest';
import { ALERTS } from '@/data/alerts';
import { NEWS } from '@/data/news';
import { canAccess, filterNews, getAppsFor, getVisibleAlerts, getVisibleNews } from '@/lib/selectors';
import { APPS_BY_ID } from '@/config/apps';

describe('getVisibleAlerts', () => {
  it('always keeps group-wide and critical alerts, whichever business is selected', () => {
    const ids = getVisibleAlerts(ALERTS, 'academy').map((a) => a.id);
    expect(ids).toContain('a1'); // critical, group-wide
    expect(ids).toContain('a3'); // info, group-wide
  });

  it('hides other businesses\u2019 company-only alerts', () => {
    const ids = getVisibleAlerts(ALERTS, 'holidays').map((a) => a.id);
    expect(ids).toContain('a4'); // holidays warning
    expect(ids).not.toContain('a2'); // OTA warning
    expect(ids).not.toContain('a5'); // academy info
  });

  it('shows everything in the group-wide view', () => {
    expect(getVisibleAlerts(ALERTS, 'group')).toHaveLength(ALERTS.length);
  });

  it('puts critical first, then warning, then info', () => {
    const order = getVisibleAlerts(ALERTS, 'group').map((a) => a.severity);
    expect(order).toEqual([...order].sort((a, b) => ['critical', 'warning', 'info'].indexOf(a) - ['critical', 'warning', 'info'].indexOf(b)));
    expect(order[0]).toBe('critical');
  });
});

describe('getVisibleNews and filterNews', () => {
  it('keeps group-wide news and the selected business only', () => {
    const items = getVisibleNews(NEWS, 'ota');
    expect(items.every((n) => n.scope === 'group' || n.companyId === 'ota')).toBe(true);
  });

  it('sorts newest first', () => {
    const dates = getVisibleNews(NEWS, 'group').map((n) => n.publishedAt);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('filters by group-wide and by audience', () => {
    const all = getVisibleNews(NEWS, 'group');
    expect(filterNews(all, 'group').every((n) => n.scope === 'group')).toBe(true);
    expect(filterNews(all, 'internal').every((n) => n.audience === 'internal')).toBe(true);
    expect(filterNews(all, 'all')).toHaveLength(all.length);
  });
});

describe('role and company access to apps', () => {
  it('gives a facilities technician fewer apps than a contact-centre agent', () => {
    expect(getAppsFor('facilities-technician', 'group').length).toBeLessThan(
      getAppsFor('contact-centre-agent', 'group').length,
    );
  });

  it('hides apps a business does not offer', () => {
    expect(canAccess(APPS_BY_ID['booking-tools'], 'academy')).toBe(false);
    expect(canAccess(APPS_BY_ID['crm'], 'academy')).toBe(true);
    expect(getAppsFor('contact-centre-agent', 'academy').map((a) => a.id)).not.toContain('booking-tools');
  });
});
