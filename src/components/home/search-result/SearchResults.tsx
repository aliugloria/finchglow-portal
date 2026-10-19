'use client';

import { ArrowRight, LoaderCircle, SearchX, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { COMPANIES_BY_ID } from '@/config/companies';
import { Icon } from '@/components/ui/Icon';
import { SeverityBadge, SeverityIcon } from '@/components/ui/severity/SeverityBadge';
import { cx } from '@/lib/cx';
import { formatAgo, formatDate } from '@/lib/format';
import { searchPortal, type SearchResults as Results } from '@/lib/search';
import { usePortal } from '@/providers/PortalProvider';
import type { Scope, CompanyId } from '@/types';
import styles from './SearchResults.module.scss';

type State = { status: 'loading' } | { status: 'error' } | { status: 'done'; results: Results };
type Filter = 'all' | 'apps' | 'news' | 'alerts';

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'apps', label: 'Apps' },
  { id: 'news', label: 'News' },
  { id: 'alerts', label: 'Alerts' },
];

function useSearch(term: string) {
  const { company, persona } = usePortal();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let stale = false; // ignore answers to an older query
    setState({ status: 'loading' });
    const timer = setTimeout(() => {
      searchPortal(term, company.id, persona.roleId)
        .then((results) => !stale && setState({ status: 'done', results }))
        .catch(() => !stale && setState({ status: 'error' }));
    }, 250); // debounce typing
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [term, company.id, persona.roleId, attempt]);

  return { state, retry: () => setAttempt((n) => n + 1) };
}

function scopeLabel(scope: Scope, companyId?: CompanyId) {
  return scope === 'group' ? 'Group-wide' : COMPANIES_BY_ID[companyId ?? 'group'].shortName;
}

export function SearchResults() {
  const { query, setQuery, openAlert } = usePortal();
  const term = query.trim();
  const { state, retry } = useSearch(term);
  const [filter, setFilter] = useState<Filter>('all');

  const results = state.status === 'done' ? state.results : null;
  const show = (f: Exclude<Filter, 'all'>) => filter === 'all' || filter === f;
  const apps = results && show('apps') ? results.apps : [];
  const news = results && show('news') ? results.news : [];
  const alerts = results && show('alerts') ? results.alerts : [];
  const total = apps.length + news.length + alerts.length;

  const status =
    state.status === 'loading' ? 'Searching' : state.status === 'error' ? 'Search failed' : `${total} results`;

  return (
    <section className={styles.panel} aria-labelledby="search-heading">
      <h1 id="search-heading" className={styles.heading}>
        Results for &ldquo;{term}&rdquo;
      </h1>

      <div className={styles.filters} role="group" aria-label="Filter results">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={cx(styles.chip, filter === f.id && styles.active)}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p role="status" className="sr-only">
        {status}
      </p>

      {state.status === 'loading' && (
        <div className={styles.loading} aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.skeleton}>
              <span className={styles.skeletonIcon} />
              <span className={styles.skeletonLines}>
                <span />
                <span />
              </span>
            </div>
          ))}
          <p className={styles.searching}>
            <LoaderCircle size={18} className={styles.spinner} /> Searching…
          </p>
        </div>
      )}

      {state.status === 'error' && (
        <div className={styles.message}>
          <WifiOff aria-hidden="true" size={32} />
          <h2>Search isn&rsquo;t working right now</h2>
          <p>Check your connection and try again.</p>
          <button type="button" className={styles.action} onClick={retry}>
            Try again
          </button>
        </div>
      )}

      {results && total === 0 && (
        <div className={styles.message}>
          <SearchX aria-hidden="true" size={32} />
          <h2>No results found</h2>
          <p>Try a different keyword or check for typos.</p>
          <button type="button" className={styles.action} onClick={() => setQuery('')}>
            Clear search
          </button>
        </div>
      )}

      {apps.length > 0 && (
        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Apps</h2>
          <ul>
            {apps.map((app) => (
              <li key={app.id}>
                <a href={app.href} className={styles.row}>
                  <span className={styles.icon} data-tone={app.tone}>
                    <Icon name={app.icon} size={22} />
                  </span>
                  <span className={styles.text}>
                    <span className={styles.title}>{app.name}</span>
                  </span>
                  <ArrowRight aria-hidden="true" size={18} className={styles.arrow} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {news.length > 0 && (
        <div className={styles.group}>
          <h2 className={styles.groupTitle}>News</h2>
          <ul>
            {news.map((item) => (
              <li key={item.id} className={styles.row}>
                <span className={styles.icon}>
                  <Icon name={item.icon} size={22} />
                </span>
                <span className={styles.text}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.meta}>
                    {scopeLabel(item.scope, item.companyId)} · {item.category}
                  </span>
                </span>
                <time className={styles.when} dateTime={item.publishedAt}>
                  {formatDate(item.publishedAt)}
                </time>
              </li>
            ))}
          </ul>
        </div>
      )}

      {alerts.length > 0 && (
        <div className={styles.group}>
          <h2 className={styles.groupTitle}>Alerts</h2>
          <ul>
            {alerts.map((alert) => (
              <li key={alert.id}>
                <button type="button" className={cx(styles.row, styles.alertButton)} aria-haspopup="dialog" aria-label={`View alert: ${alert.title}`} onClick={() => openAlert(alert)}>
                <span className={styles.severity} data-severity={alert.severity}>
                  <SeverityIcon severity={alert.severity} size={22} />
                </span>
                <span className={styles.text}>
                  <span className={styles.title}>{alert.title}</span>
                  <span className={styles.meta}>
                    <SeverityBadge severity={alert.severity} /> {scopeLabel(alert.scope, alert.companyId)}
                  </span>
                </span>
                <span className={styles.when}>{formatAgo(alert.minutesAgo)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
