'use client';

import { Check } from 'lucide-react';
import { usePortal } from '@/providers/PortalProvider';
import type { NewsItem } from '@/types';
import styles from './ActivityIndicators.module.scss';

export function NewsReadToggle({ item }: { item: NewsItem }) {
  const { readNews, toggleNewsRead } = usePortal();
  const read = readNews.includes(item.id);
  return (
    <button
      type="button"
      className={styles.newsStatus}
      data-read={read}
      aria-label={`Mark ${item.title} as ${read ? 'unread' : 'read'}`}
      aria-pressed={read}
      onClick={() => toggleNewsRead(item.id)}
    >
      {read ? <Check size={12} aria-hidden="true" /> : <span className={styles.dot} aria-hidden="true" />}
      {read ? 'Read' : 'Unread'}
    </button>
  );
}

export function RecentlyUsedBadge({ appId }: { appId: string }) {
  const { recentApps } = usePortal();
  if (recentApps[0] !== appId) return null;
  return <span className={styles.recent}>Recently used</span>;
}
