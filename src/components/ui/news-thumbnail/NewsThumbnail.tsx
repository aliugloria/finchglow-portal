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
        <a
          className={styles.photoLink}
          href={image.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Photo by ${image.photographer} on Unsplash (opens in a new tab)`}
          title={`Photo by ${image.photographer} on Unsplash`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={compact ? '44px' : '(min-width: 768px) 88px, 64px'}
            className={styles.image}
            loading="lazy"
            onError={() => setFailedSrc(image.src)}
          />
        </a>
      ) : <Icon name={item.icon} size={compact ? 22 : 24} />}
    </span>
  );
}
