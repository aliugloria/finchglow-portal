'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { COMPANIES_BY_ID } from '@/config/companies';
import { ROLES_BY_ID } from '@/config/roles';
import { ALERTS } from '@/data/alerts';
import { NEWS } from '@/data/news';
import { PERSONAS, PERSONAS_BY_ID } from '@/data/personas';
import { getAppsFor, getVisibleAlerts, getVisibleNews } from '@/lib/selectors';
import type { Alert, AppConfig, CompanyConfig, CompanyId, NewsItem, Persona, RoleConfig } from '@/types';

interface PortalState {
  company: CompanyConfig;
  setCompanyId: (id: CompanyId) => void;
  persona: Persona;
  setPersonaId: (id: string) => void;
  role: RoleConfig;
  apps: AppConfig[];
  alerts: Alert[];
  news: NewsItem[];
  acknowledged: ReadonlySet<string>;
  acknowledge: (id: string) => void;
  /** Critical alerts the user has not acknowledged yet. */
  pendingCritical: Alert[];
}

const PortalContext = createContext<PortalState | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyId] = useState<CompanyId>('group');
  const [personaId, setPersonaId] = useState<string>(PERSONAS[0].id);
  const [acknowledged, setAcknowledged] = useState<ReadonlySet<string>>(new Set());

  const acknowledge = useCallback((id: string) => {
    setAcknowledged((prev) => new Set(prev).add(id));
  }, []);

  const value = useMemo<PortalState>(() => {
    const persona = PERSONAS_BY_ID[personaId];
    const alerts = getVisibleAlerts(ALERTS, companyId);
    return {
      company: COMPANIES_BY_ID[companyId],
      setCompanyId,
      persona,
      setPersonaId,
      role: ROLES_BY_ID[persona.roleId],
      apps: getAppsFor(persona.roleId, companyId),
      alerts,
      news: getVisibleNews(NEWS, companyId),
      acknowledged,
      acknowledge,
      pendingCritical: alerts.filter((a) => a.severity === 'critical' && !acknowledged.has(a.id)),
    };
  }, [companyId, personaId, acknowledged, acknowledge]);

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

export function usePortal(): PortalState {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used inside <PortalProvider>');
  return ctx;
}
