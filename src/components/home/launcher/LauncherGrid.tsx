'use client';

import { ArrowRight } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';
import { usePortal } from '@/providers/PortalProvider';
import styles from './LauncherGrid.module.scss';

export function LauncherGrid() {
  const { apps, company, role } = usePortal();

  return (
    <section id="apps" className={styles.section} aria-labelledby="apps-heading">
      <h2 id="apps-heading" className={styles.heading}>
        Your apps
      </h2>
      {apps.length === 0 ? (
        <p className={styles.empty}>
          No apps for {role.label.toLowerCase()} in {company.name}. Switch business to see more.
        </p>
      ) : (
        <ul className={styles.grid}>
          {apps.map((app) => (
            <li key={app.id}>
              <a href={app.href} className={styles.tile} data-tone={app.tone}>
                <span className={styles.icon}>
                  <Icon name={app.icon} size={26} />
                </span>
                <span className={styles.name}>{app.name}</span>
                <ArrowRight aria-hidden="true" size={16} className={styles.arrow} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
