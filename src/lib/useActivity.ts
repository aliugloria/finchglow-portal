'use client';

import { useCallback, useEffect, useState } from 'react';

type Activity = { readNews: string[]; recentApps: string[] };
type ActivityByPerson = Record<string, Activity>;
const STORAGE_KEY = 'finchglow.activity.v1';
const EMPTY: Activity = { readNews: [], recentApps: [] };

export function useActivity(personaId: string) {
  const [activity, setActivity] = useState<ActivityByPerson>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
      if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return;
      const valid: ActivityByPerson = {};
      for (const [id, entry] of Object.entries(saved)) {
        if (!entry || typeof entry !== 'object') continue;
        const { readNews, recentApps } = entry;
        if (!Array.isArray(readNews) || !Array.isArray(recentApps)) continue;
        valid[id] = {
          readNews: readNews.filter((value): value is string => typeof value === 'string'),
          recentApps: [...new Set(recentApps.filter((value): value is string => typeof value === 'string'))].slice(0, 1),
        };
      }
      setActivity(valid);
    } catch {
      // Activity still works for this visit when browser storage is unavailable.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activity));
    } catch {
      // Keep the in-memory state if storage is blocked or full.
    }
  }, [activity, loaded]);

  const update = useCallback((change: (previous: Activity) => Activity) => {
    setActivity((previous) => ({
      ...previous,
      [personaId]: change(previous[personaId] ?? EMPTY),
    }));
  }, [personaId]);

  const toggleNewsRead = useCallback((id: string) => update((previous) => ({
    ...previous,
    readNews: previous.readNews.includes(id)
      ? previous.readNews.filter((value) => value !== id)
      : [...previous.readNews, id],
  })), [update]);

  const recordAppUse = useCallback((id: string) => update((previous) => ({
    ...previous,
    recentApps: [id],
  })), [update]);

  return { ...(activity[personaId] ?? EMPTY), toggleNewsRead, recordAppUse };
}
