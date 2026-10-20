"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { COMPANIES_BY_ID } from "@/config/companies";
import { ROLES_BY_ID } from "@/config/roles";
import { PERSONAS, PERSONAS_BY_ID } from "@/data/personas";
import { getAppsFor, getVisibleAlerts } from "@/lib/selectors";
import type {
  Alert,
  AppConfig,
  CompanyConfig,
  CompanyId,
  Persona,
  RoleConfig,
} from "@/types";
import { useRemote } from "@/lib/useRemote";
import { fetchAlerts } from "@/lib/api";
import { useActivity } from "@/lib/useActivity";

interface PortalState {
  company: CompanyConfig;
  setCompanyId: (id: CompanyId) => void;
  persona: Persona;
  setPersonaId: (id: string) => void;
  role: RoleConfig;
  apps: AppConfig[];
  alerts: Alert[];
  alertsStatus: "loading" | "error" | "success";
  retryAlerts: () => void;
  query: string;
  setQuery: (query: string) => void;
  acknowledged: ReadonlySet<string>;
  acknowledge: (id: string) => void;
  pendingCritical: Alert[];
  selectedAlert: Alert | null;
  openAlert: (alert: Alert) => void;
  closeAlert: () => void;
  readNews: string[];
  recentApps: string[];
  toggleNewsRead: (id: string) => void;
  recordAppUse: (id: string) => void;
}

const PortalContext = createContext<PortalState | null>(null);
const NO_ALERTS: Alert[] = [];

export function PortalProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyId] = useState<CompanyId>("group");
  const [personaId, setPersonaId] = useState<string>(PERSONAS[0].id);
  const { readNews, recentApps, toggleNewsRead, recordAppUse } = useActivity(personaId);
  const [query, setQuery] = useState("");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const closeAlert = useCallback(() => setSelectedAlert(null), []);
  const [acknowledged, setAcknowledged] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const { state: alertsState, retry: retryAlerts } = useRemote(fetchAlerts, []);
  const allAlerts =
    alertsState.status === "success" ? alertsState.data : NO_ALERTS;

  const acknowledge = useCallback((id: string) => {
    setAcknowledged((prev) => new Set(prev).add(id));
  }, []);

  const value = useMemo<PortalState>(() => {
    const persona = PERSONAS_BY_ID[personaId];
    const alerts = getVisibleAlerts(allAlerts, companyId);
    return {
      company: COMPANIES_BY_ID[companyId],
      setCompanyId,
      persona,
      setPersonaId,
      role: ROLES_BY_ID[persona.roleId],
      apps: getAppsFor(persona.roleId, companyId).sort((a, b) =>
        Number(b.id === recentApps[0]) - Number(a.id === recentApps[0]),
      ),
      alerts,
      alertsStatus: alertsState.status,
      retryAlerts,
      query,
      setQuery,
      selectedAlert,
      openAlert: setSelectedAlert,
      closeAlert,
      readNews,
      recentApps,
      toggleNewsRead,
      recordAppUse,
      acknowledged,
      acknowledge,
      pendingCritical: alerts.filter(
        (a) => a.severity === "critical" && !acknowledged.has(a.id),
      ),
    };
  }, [
    companyId,
    personaId,
    allAlerts,
    alertsState.status,
    retryAlerts,
    query,
    selectedAlert,
    closeAlert,
    readNews,
    recentApps,
    toggleNewsRead,
    recordAppUse,
    acknowledged,
    acknowledge,
  ]);

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}

export function usePortal(): PortalState {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used inside <PortalProvider>");
  return ctx;
}
