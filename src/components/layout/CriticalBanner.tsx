'use client';

import { CircleAlert } from 'lucide-react';
import { usePortal } from '@/providers/PortalProvider';
import styles from './CriticalBanner.module.scss';

/** Sticky, full-width, and only removed once the person acknowledges it. */
export function CriticalBanner() {
  const { pendingCritical, acknowledge } = usePortal();
  const alert = pendingCritical[0];
  if (!alert) return null;

  const others = pendingCritical.length - 1;

  return (
    <div className={styles.banner} role="alert">
      <div className={styles.message}>
        <CircleAlert aria-hidden="true" size={24} className={styles.icon} />
        <p>
          <strong className={styles.label}>Critical:</strong> {alert.title}
          {others > 0 && <span className={styles.more}> (+{others} more)</span>}
        </p>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={() => acknowledge(alert.id)}>
          Acknowledge
        </button>
        <a href="#alerts" className={styles.secondary}>
          View details
        </a>
      </div>
    </div>
  );
}
