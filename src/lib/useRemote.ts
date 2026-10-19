import { useCallback, useEffect, useState } from 'react';

export type Remote<T> = { status: 'loading' } | { status: 'error' } | { status: 'success'; data: T };

export function useRemote<T>(load: () => Promise<T>, deps: readonly unknown[]) {
  const [state, setState] = useState<Remote<T>>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let stale = false; // ignore answers that arrive after the inputs changed
    setState({ status: 'loading' });
    load()
      .then((data) => !stale && setState({ status: 'success', data }))
      .catch(() => !stale && setState({ status: 'error' }));
    return () => {
      stale = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { state, retry };
}
