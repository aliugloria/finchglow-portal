import { APPS_BY_ID } from '@/config/apps';
import { ROLES_BY_ID } from '@/config/roles';
import type { Alert, AppConfig, CompanyId, NewsFilter, NewsItem, RoleId, Severity } from '@/types';

const SEVERITY_RANK: Record<Severity, number> = { critical: 0, warning: 1, info: 2 };

/**
 * Group-wide alerts are always visible, whichever company is selected.
 * Critical alerts ignore every filter.
 */
export function getVisibleAlerts(alerts: Alert[], companyId: CompanyId): Alert[] {
  return alerts
    .filter(
      (a) =>
        a.severity === 'critical' ||
        a.scope === 'group' ||
        companyId === 'group' ||
        a.companyId === companyId,
    )
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || a.minutesAgo - b.minutesAgo);
}

export function getVisibleNews(news: NewsItem[], companyId: CompanyId): NewsItem[] {
  return news
    .filter((n) => n.scope === 'group' || companyId === 'group' || n.companyId === companyId)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function canAccess(app: AppConfig, companyId: CompanyId): boolean {
  return companyId === 'group' || app.companies === 'all' || app.companies.includes(companyId);
}

export function getAppsFor(roleId: RoleId, companyId: CompanyId): AppConfig[] {
  return ROLES_BY_ID[roleId].appIds.map((id) => APPS_BY_ID[id]).filter((app) => canAccess(app, companyId));
}

export function filterNews(news: NewsItem[], filter: NewsFilter): NewsItem[] {
  if (filter === 'all') return news;
  if (filter === 'group') return news.filter((n) => n.scope === 'group');
  return news.filter((n) => n.audience === filter);
}
