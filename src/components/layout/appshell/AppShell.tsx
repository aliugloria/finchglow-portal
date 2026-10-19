'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { themeStyle } from '@/lib/theme';
import { usePortal } from '@/providers/PortalProvider';
import styles from './AppShell.module.scss';
import { CriticalBanner } from '../critical-banner/CriticalBanner';
import { Sidebar } from '../sidebar/Sidebar';
import { Header } from '../header/Header';
import { BottomNav } from '../mobile-nav/BottomNav';
import { AlertDetailsModal } from '@/components/ui/alert-details/AlertDetailsModal';

export function AppShell({ children }: { children: ReactNode }) {
  const { company, pendingCritical } = usePortal();
  const shellRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    const updateOffset = () => {
      shellRef.current?.style.setProperty('--banner-offset', `${banner?.getBoundingClientRect().height ?? 0}px`);
    };
    updateOffset();
    if (!banner) return;
    // The banner wraps on phones; section links must clear its actual height.
    const observer = new ResizeObserver(updateOffset);
    observer.observe(banner);
    return () => observer.disconnect();
  }, [pendingCritical.length]);

  return (
    <div ref={shellRef} className={styles.shell} style={themeStyle(company)} data-banner={pendingCritical.length > 0}>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <CriticalBanner ref={bannerRef} />
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
      <AlertDetailsModal />
    </div>
  );
}
