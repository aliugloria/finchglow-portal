'use client';

import { SeverityBadge, SeverityIcon } from '@/components/ui/SeverityBadge';
import { formatAgo } from '@/lib/format';
import { usePortal } from '@/providers/PortalProvider';
import styles from './AlertsCard.module.scss';

export function AlertsCard() {
  const { alerts, acknowledged } = usePortal();

  return (
    <section id="alerts" className={styles.card} aria-labelledby="alerts-heading">
      <h2 id="alerts-heading" className={styles.heading}>
        Alerts
      </h2>
      {alerts.length === 0 ? (
        <p className={styles.empty}>No active alerts. You&rsquo;re all caught up.</p>
      ) : (
        <ul className={styles.list}>
          {alerts.map((alert) => (
            <li key={alert.id} className={styles.item} data-severity={alert.severity}>
              <span className={styles.icon}>
                <SeverityIcon severity={alert.severity} />
              </span>
              <div className={styles.body}>
                <div className={styles.titleRow}>
                  <h3 className={styles.title}>{alert.title}</h3>
                  <SeverityBadge severity={alert.severity} />
                  {acknowledged.has(alert.id) && <span className={styles.ack}>Acknowledged</span>}
                </div>
                <p className={styles.desc}>{alert.description}</p>
              </div>
              <span className={styles.time}>{formatAgo(alert.minutesAgo)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
