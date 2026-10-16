'use client';

import { useState } from 'react';
import { COMPANIES_BY_ID } from '@/config/companies';
import { Icon } from '@/components/ui/Icon';
import { formatDate } from '@/lib/format';
import { cx } from '@/lib/cx';
import { usePortal } from '@/providers/PortalProvider';
import type { NewsItem } from '@/types';
import styles from './NewsCard.module.scss';

type Filter = 'all' | 'group' | 'internal' | 'external';

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'group', label: 'Group-wide' },
  { id: 'internal', label: 'Internal' },
  { id: 'external', label: 'External' },
];

function matches(item: NewsItem, filter: Filter): boolean {
  if (filter === 'all') return true;
  if (filter === 'group') return item.scope === 'group';
  return item.audience === filter;
}

export function NewsCard() {
  const { news } = usePortal();
  const [filter, setFilter] = useState<Filter>('all');
  const items = news.filter((item) => matches(item, filter));

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
      {items.length === 0 ? (
        <p className={styles.empty}>No news for this filter. Try another one.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
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
