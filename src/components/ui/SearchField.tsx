'use client';

import { Search } from 'lucide-react';
import styles from './SearchField.module.scss';

/** Layout only for now: search logic and states come next. */
export function SearchField() {
  return (
    <form role="search" className={styles.search} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="portal-search" className="sr-only">
        Search apps, news and alerts
      </label>
      <Search aria-hidden="true" size={18} className={styles.icon} />
      <input id="portal-search" name="q" type="search" placeholder="Search apps, news, alerts…" autoComplete="off" />
    </form>
  );
}
