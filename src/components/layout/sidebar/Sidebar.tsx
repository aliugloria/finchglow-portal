'use client';

import { flushSync } from 'react-dom';

import { NAV_ITEMS } from '@/config/navigation';
import { Icon } from '@/components/ui/Icon';
import { usePortal } from '@/providers/PortalProvider';
import styles from './Sidebar.module.scss';
import { Logo } from '@/components/ui/logo/Logo';

export function Sidebar() {
  const { alerts, setQuery } = usePortal();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Logo />
      </div>
      <nav aria-label="Primary">
        <ul className={styles.list}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a href={item.href} onClick={() => flushSync(() => setQuery(''))} className={styles.link} aria-current={item.id === 'home' ? 'page' : undefined}>
                <Icon name={item.icon} size={20} />
                <span className={styles.label}>{item.label}</span>
                {item.id === 'alerts' && alerts.length > 0 && (
                  <span className={styles.badge}>
                    {alerts.length}
                    <span className="sr-only"> active alerts</span>
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
