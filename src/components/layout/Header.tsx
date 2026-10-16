'use client';

import { Bell } from 'lucide-react';
import { usePortal } from '@/providers/PortalProvider';
import { CompanySwitcher } from '@/components/ui/CompanySwitcher';
import { Logo } from '@/components/ui/Logo';
import { PersonaMenu } from '@/components/ui/PersonaMenu';
import { SearchField } from '@/components/ui/SearchField';
import styles from './Header.module.scss';

export function Header() {
  const { alerts } = usePortal();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Logo />
      </div>
      <div className={styles.switcher}>
        <CompanySwitcher />
      </div>
      <div className={styles.search}>
        <SearchField />
      </div>
      <div className={styles.actions}>
        <a href="#alerts" className={styles.bell} aria-label={`${alerts.length} alerts`}>
          <Bell aria-hidden="true" size={22} />
          <span className={styles.count} aria-hidden="true">
            {alerts.length}
          </span>
        </a>
        <PersonaMenu />
      </div>
    </header>
  );
}
