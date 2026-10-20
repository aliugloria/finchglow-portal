'use client';

import { ErrorState, SkeletonRows } from '@/components/ui/FeedState';
import { formatAgo } from '@/lib/format';
import { usePortal } from '@/providers/PortalProvider';
import styles from './AlertsCard.module.scss';
import { SeverityBadge, SeverityIcon } from '@/components/ui/severity/SeverityBadge';

export function AlertsCard() {
  const { alerts, alertsStatus, retryAlerts, acknowledged, openAlert } = usePortal();

  return (
    <section id="alerts" className={styles.card} aria-labelledby="alerts-heading">
      <h2 id="alerts-heading" className={styles.heading}>
        Alerts
      </h2>
      <p role="status" className="sr-only">
        {alertsStatus === 'loading' ? 'Loading alerts' : alertsStatus === 'error' ? 'Alerts failed to load' : ''}
      </p>
      {alertsStatus === 'loading' && <SkeletonRows count={3} />}
      {alertsStatus === 'error' && <ErrorState title="Alerts couldn’t load" onRetry={retryAlerts} />}
      {alertsStatus === 'success' && alerts.length === 0 && (
        <p className={styles.empty}>No active alerts. You&rsquo;re all caught up.</p>
      )}
      {alertsStatus === 'success' && alerts.length > 0 && (
        <ul className={styles.list}>
          {alerts.map((alert) => (
            <li key={alert.id} className={styles.item} data-severity={alert.severity}>
              <span className={styles.icon}>
                <SeverityIcon severity={alert.severity} />
              </span>
              <div className={styles.body}>
                <div className={styles.titleRow}>
                  <h3 className={styles.title}>
                    <button type="button" className={styles.details} aria-haspopup="dialog" aria-label={`View alert: ${alert.title}`} onClick={() => openAlert(alert)}>
                      {alert.title}
                    </button>
                  </h3>
                  {/* <SeverityBadge severity={alert.severity} /> */}
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
