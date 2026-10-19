import { ALERTS } from '@/data/alerts';
import { NEWS } from '@/data/news';
import { filterNews, getVisibleNews } from '@/lib/selectors';
import type { Alert, CompanyId, NewsFilter, NewsItem } from '@/types';
import { simulateNetwork } from './mock';

export async function fetchAlerts(): Promise<Alert[]> {
  await simulateNetwork();
  return ALERTS;
}

export async function fetchNews(companyId: CompanyId, filter: NewsFilter): Promise<NewsItem[]> {
  await simulateNetwork();
  return filterNews(getVisibleNews(NEWS, companyId), filter);
}
