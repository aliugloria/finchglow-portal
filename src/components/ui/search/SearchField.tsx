'use client';

import { Search, X } from 'lucide-react';
import { useRef } from 'react';
import { usePortal } from '@/providers/PortalProvider';
import styles from './SearchField.module.scss';

export function SearchField() {
  const { query, setQuery } = usePortal();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form role="search" className={styles.search} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="portal-search" className="sr-only">
        Search apps, news and alerts
      </label>
      <Search aria-hidden="true" size={18} className={styles.icon} />
      <input
        ref={inputRef}
        id="portal-search"
        name="q"
        type="text"
        inputMode="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Escape' && setQuery('')}
        placeholder="Search apps, news, alerts…"
        autoComplete="off"
      />
      {query && (
        <button
          type="button"
          className={styles.clear}
          aria-label="Clear search"
          onClick={() => {
            setQuery('');
            inputRef.current?.focus();
          }}
        >
          <X aria-hidden="true" size={18} />
        </button>
      )}
    </form>
  );
}
 