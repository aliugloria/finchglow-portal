'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { cx } from '@/lib/cx';
import type { NewsItem } from '@/types';
import styles from './NewsThumbnail.module.scss';

export function NewsThumbnail({ item, compact = false }: { item: NewsItem; compact?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const image = item.audience === 'external' ? item.image : undefined;
  const showPhoto = image && image.src !== failedSrc;

  return (
    <span className={cx(styles.thumb, image && styles.photo, compact && styles.compact)}>
      {showPhoto ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={compact ? '44px' : '(min-width: 768px) 88px, 64px'}
          className={styles.image}
          loading="lazy"
          onError={() => setFailedSrc(image.src)}
        />
      ) : <Icon name={item.icon} size={compact ? 22 : 24} />}
    </span>
  );
}

export function NewsPhotoCredit({ item }: { item: NewsItem }) {
  if (item.audience !== 'external' || !item.image) return null;

  return (
    <span className={styles.credit}>
      Photo: <a href={item.image.photographerUrl} target="_blank" rel="noopener noreferrer">{item.image.photographer}</a>
      {' · '}<a href={item.image.sourceUrl} target="_blank" rel="noopener noreferrer">Unsplash</a>
    </span>
  );
}
