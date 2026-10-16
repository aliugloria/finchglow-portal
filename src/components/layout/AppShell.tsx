'use client';

import type { ReactNode } from 'react';
import { themeStyle } from '@/lib/theme';
import { usePortal } from '@/providers/PortalProvider';
import { BottomNav } from './BottomNav';
import { CriticalBanner } from './CriticalBanner';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import styles from './AppShell.module.scss';

/** Page frame. Company theming is applied here as CSS variables. */
export function AppShell({ children }: { children: ReactNode }) {
  const { company, pendingCritical } = usePortal();

  return (
    <div className={styles.shell} style={themeStyle(company)} data-banner={pendingCritical.length > 0}>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <CriticalBanner />
      <div className={styles.body}>
        <Sidebar />
        <div className={styles.column}>
          <Header />
          <main id="main" tabIndex={-1} className={styles.main}>
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
