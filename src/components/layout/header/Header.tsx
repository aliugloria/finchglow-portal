'use client';

import { flushSync } from 'react-dom';

import { Bell } from 'lucide-react';
import { usePortal } from '@/providers/PortalProvider';
import styles from './Header.module.scss';
import { Logo } from '@/components/ui/logo/Logo';
import { CompanySwitcher } from '@/components/ui/company-switch/CompanySwitcher';
import { SearchField } from '@/components/ui/search/SearchField';
import { PersonaMenu } from '@/components/ui/personal-menu/PersonaMenu';

export function Header() {
  const { alerts, setQuery } = usePortal();

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
        <a href="#alerts" onClick={() => flushSync(() => setQuery(''))} className={styles.bell} aria-label={`${alerts.length} alerts`}>
          <Bell aria-hidden="true" size={22} />
          {alerts.length > 0 && (
            <span className={styles.count} aria-hidden="true">
              {alerts.length}
            </span>
          )}
        </a>
        <PersonaMenu />
      </div>
    </header>
  );
}
