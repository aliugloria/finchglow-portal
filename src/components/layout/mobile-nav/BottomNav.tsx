'use client';

import { flushSync } from 'react-dom';
import { CompanySwitcher } from '@/components/ui/company-switch/CompanySwitcher';
import { NAV_ITEMS } from '@/config/navigation';
import { Icon } from '@/components/ui/Icon';
import { usePortal } from '@/providers/PortalProvider';
import styles from './BottomNav.module.scss';

export function BottomNav() {
  const { alerts, setQuery } = usePortal();
  const [home, apps, alertsItem, news] = NAV_ITEMS;
  const left = [home, apps];
  const right = [alertsItem, news];

  const renderItem = (item: (typeof NAV_ITEMS)[number]) => (
    <li key={item.id}>
      <a href={item.href} onClick={() => flushSync(() => setQuery(''))} className={styles.link} aria-current={item.id === 'home' ? 'page' : undefined}>
        <span className={styles.iconWrap}>
          <Icon name={item.icon} size={22} />
          {item.id === 'alerts' && alerts.length > 0 && (
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
          <CompanySwitcher placement="bottom-nav" />
        </li>
        {right.map(renderItem)}
      </ul>
    </nav>
  );
}
