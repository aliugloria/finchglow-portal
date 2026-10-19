import { ALERTS } from '@/data/alerts';
import { NEWS } from '@/data/news';
import { simulateNetwork } from '@/lib/mock';
import { getAppsFor, getVisibleAlerts, getVisibleNews } from '@/lib/selectors';
import type { Alert, AppConfig, CompanyId, NewsItem, RoleId } from '@/types';

export interface SearchResults {
  apps: AppConfig[];
  news: NewsItem[];
  alerts: Alert[];
}

function matches(terms: string[], ...fields: string[]): boolean {
  const text = fields.join(' ').toLowerCase();
  return terms.every((term) => text.includes(term));
}

export async function searchPortal(query: string, companyId: CompanyId, roleId: RoleId): Promise<SearchResults> {
  await simulateNetwork();

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return {
    apps: getAppsFor(roleId, companyId).filter((a) => matches(terms, a.name)),
    news: getVisibleNews(NEWS, companyId).filter((n) => matches(terms, n.title, n.summary, n.category)),
    alerts: getVisibleAlerts(ALERTS, companyId).filter((a) => matches(terms, a.title, a.description)),
  };
}
