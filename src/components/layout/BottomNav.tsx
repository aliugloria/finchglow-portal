'use client';

import { Search } from 'lucide-react';
import { NAV_ITEMS } from '@/config/navigation';
import { Icon } from '@/components/ui/Icon';
import { usePortal } from '@/providers/PortalProvider';
import styles from './BottomNav.module.scss';

function focusSearch() {
  const input = document.getElementById('portal-search');
  input?.scrollIntoView({ block: 'center' });
  input?.focus();
}

/** Phone and tablet navigation. Hidden from the desktop breakpoint up. */
export function BottomNav() {
  const { alerts } = usePortal();
  const [home, apps, alertsItem, news] = NAV_ITEMS;
  const left = [home, apps];
  const right = [alertsItem, news];

  const renderItem = (item: (typeof NAV_ITEMS)[number]) => (
    <li key={item.id}>
      <a href={item.href} className={styles.link} aria-current={item.id === 'home' ? 'page' : undefined}>
        <span className={styles.iconWrap}>
          <Icon name={item.icon} size={22} />
          {item.id === 'alerts' && (
            <span className={styles.badge} aria-hidden="true">
              {alerts.length}
            </span>
          )}
        </span>
        <span>{item.label}</span>
      </a>
    </li>
  );

  return (
    <nav aria-label="Primary" className={styles.nav}>
      <ul className={styles.list}>
        {left.map(renderItem)}
        <li className={styles.fabSlot}>
          <button type="button" className={styles.fab} onClick={focusSearch} aria-label="Search">
            <Search aria-hidden="true" size={24} />
          </button>
        </li>
        {right.map(renderItem)}
      </ul>
    </nav>
  );
}
