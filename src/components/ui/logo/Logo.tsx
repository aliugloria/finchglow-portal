'use client';

import { Icon } from '../Icon';
import { usePortal } from '@/providers/PortalProvider';
import styles from './Logo.module.scss';

export function Logo({ compact = false }: { compact?: boolean }) {
  const { company } = usePortal();

  return (
    <span className={styles.logo} data-compact={compact}>
      <span className={styles.mark}>
        <Icon name={company.id === 'group' ? 'plane' : company.icon} size={22} />
      </span>
      <span className={styles.text}>
        <span className={styles.name}>Finchglow</span>
        <span className={styles.sub}>{company.id === 'group' ? 'Holdings' : company.shortName}</span>
      </span>
    </span>
  );
}
