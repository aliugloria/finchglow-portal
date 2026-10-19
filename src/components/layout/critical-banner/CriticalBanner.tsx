'use client';

import type { Ref } from 'react';
import { CircleAlert } from 'lucide-react';
import { usePortal } from '@/providers/PortalProvider';
import styles from './CriticalBanner.module.scss';

export function CriticalBanner({ ref }: { ref?: Ref<HTMLDivElement> }) {
  const { pendingCritical, acknowledge, openAlert } = usePortal();
  const alert = pendingCritical[0];
  if (!alert) return null;

  const others = pendingCritical.length - 1;

  return (
    <div ref={ref} className={styles.banner} role="alert">
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
        <button type="button" aria-haspopup="dialog" onClick={() => openAlert(alert)} className={styles.secondary}>
          View details
        </button>
      </div>
    </div>
  );
}
