'use client';

import { flushSync } from 'react-dom';
import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { NAV_ITEMS } from '@/config/navigation';
import { Icon } from '@/components/ui/Icon';
import { usePortal } from '@/providers/PortalProvider';
import styles from './Sidebar.module.scss';
import { Logo } from '@/components/ui/logo/Logo';

const SIDEBAR_ITEMS = NAV_ITEMS
  .filter((item) => item.id !== 'news')
  .map((item) => ({ ...item, label: item.id === 'alerts' ? 'Alert & News' : item.label }));

export function Sidebar() {
  const { alerts, setQuery } = usePortal();
  const [hovered, setHovered] = useState(false);
  const [keyboardFocused, setKeyboardFocused] = useState(false);
  const pointerFocus = useRef(false);
  const reduceMotion = useReducedMotion();
  const expanded = hovered || keyboardFocused;

  return (
    <motion.aside
      className={styles.sidebar}
      data-expanded={expanded}
      initial={false}
      animate={{ width: expanded ? 256 : 80 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
      onPointerEnter={(event) => { if (event.pointerType !== 'touch') setHovered(true); }}
      onPointerLeave={() => { setHovered(false); pointerFocus.current = false; }}
      onPointerDownCapture={() => { pointerFocus.current = true; setKeyboardFocused(false); }}
      onPointerUpCapture={() => { pointerFocus.current = false; }}
      onPointerCancel={() => { pointerFocus.current = false; }}
      onFocusCapture={() => {
        if (!pointerFocus.current) setKeyboardFocused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setKeyboardFocused(false);
      }}
    >
      <div className={styles.logo}>
        <Logo compact={!expanded} />
      </div>
      <nav aria-label="Primary">
        <ul className={styles.list}>
          {SIDEBAR_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                onClick={() => flushSync(() => setQuery(''))}
                className={styles.link}
                aria-current={item.id === 'home' ? 'page' : undefined}
                aria-label={`${item.label}${item.id === 'alerts' && alerts.length > 0 ? `, ${alerts.length} active alerts` : ''}`}
                title={expanded ? undefined : item.label}
              >
                <Icon name={item.icon} size={20} />
                <motion.span
                  className={styles.label}
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: expanded ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.15 }}
                >
                  {item.label}
                </motion.span>
                {item.id === 'alerts' && alerts.length > 0 && (
                  <span className={styles.badge} aria-hidden="true">
                    {alerts.length}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
}
