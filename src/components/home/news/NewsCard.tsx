'use client';

import { useState } from 'react';
import { COMPANIES_BY_ID } from '@/config/companies';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/lib/cx';
import { formatDate } from '@/lib/format';
import { usePortal } from '@/providers/PortalProvider';
import styles from './NewsCard.module.scss';
import { NewsFilter } from '@/types';
import { useRemote } from '@/lib/useRemote';
import { fetchNews } from '@/lib/api';
import { ErrorState, SkeletonRows } from '@/components/ui/FeedState';

const FILTERS: Array<{ id: NewsFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'group', label: 'Group-wide' },
  { id: 'internal', label: 'Internal' },
  { id: 'external', label: 'External' },
];

export function NewsCard() {
  const { company } = usePortal();
  const [filter, setFilter] = useState<NewsFilter>('all');
  const { state, retry } = useRemote(() => fetchNews(company.id, filter), [company.id, filter]);

  return (
    <section id="news" className={styles.card} aria-labelledby="news-heading">
      <h2 id="news-heading" className={styles.heading}>
        Latest news
      </h2>
      <div className={styles.filters} role="group" aria-label="Filter news">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={cx(styles.chip, filter === f.id && styles.active)}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p role="status" className="sr-only">
        {state.status === 'loading' ? 'Loading news' : state.status === 'error' ? 'News failed to load' : ''}
      </p>
      {state.status === 'loading' && <SkeletonRows count={3} />}
      {state.status === 'error' && <ErrorState title="News couldn’t load" onRetry={retry} />}
      {state.status === 'success' && state.data.length === 0 && (
        <p className={styles.empty}>No news for this filter. Try another one.</p>
      )}
      {state.status === 'success' && state.data.length > 0 && (
        <ul className={styles.list}>
          {state.data.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={styles.thumb}>
                <Icon name={item.icon} size={24} />
              </span>
              <div className={styles.body}>
                <div className={styles.tags}>
                  <span className={styles.tag}>
                    {item.scope === 'group' ? 'Group-wide' : COMPANIES_BY_ID[item.companyId ?? 'group'].shortName}
                  </span>
                  <span className={styles.category}>{item.category}</span>
                </div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.summary}>{item.summary}</p>
              </div>
              <time className={styles.date} dateTime={item.publishedAt}>
                {formatDate(item.publishedAt)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
