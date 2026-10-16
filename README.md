# Finchglow Group Staff Portal

Front-end prototype for the Finchglow Holdings case study: one front door for staff across six businesses.

**Stack:** Next.js (App Router) · TypeScript · SCSS Modules with CSS variables · lucide-react · Radix UI (dropdown menus only)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

## Structure

```
src/
  app/            Routes, root layout, page composition
  components/
    layout/       AppShell, CriticalBanner, Header, Sidebar, BottomNav
    home/         Hero, LauncherGrid, AlertsCard, NewsCard
    ui/           Icon, Logo, SeverityBadge, SearchField, CompanySwitcher, PersonaMenu
  config/         Companies, roles, apps, navigation (change these, not components)
  data/           Mock alerts, news, personas
  lib/            selectors (filtering rules), format, theme, cx
  providers/      PortalProvider (selected company, persona, acknowledged alerts)
  styles/         _tokens, _reset, _mixins (breakpoints, card, menu)
  types/          Shared types
```

## How it works

- **Theming:** `config/companies.ts` holds each company's accent colours. `AppShell` turns the selected company into CSS variables (`--accent`, `--accent-dark`, `--accent-soft`), so every component re-themes with no per-company CSS.
- **Add a 7th company:** add one entry to `COMPANIES` (and the `CompanyId` type). No component changes.
- **Alert rules (`lib/selectors.ts`):** critical alerts and group-wide alerts are always visible, whichever company is selected.
- **Critical banner:** sticky, full width, `role="alert"`, removed only after "Acknowledge". The alert stays in the feed, marked as acknowledged.
- **Roles:** the persona menu is a demo-only stand-in for the user object that SSO would provide. A role decides which launcher shortcuts appear (`config/roles.ts`).
- **Layout:** mobile-first. Bottom nav below 1024px, sidebar from 1024px. Breakpoints live in `styles/_mixins.scss`.

## Sign-in (not built)

Production would use OIDC single sign-on. Unauthenticated users are redirected to the identity provider, and the returned claims (name, company, role) replace the persona object. Tokens stay in httpOnly cookies and the client ID comes from environment variables. No secrets are stored in the repo.

## Status

- [x] Layout: desktop sidebar, mobile bottom nav, tablet
- [x] Critical banner, three severities, alerts and news feeds
- [x] Company switcher with theming, role-based launcher
- [ ] Search with loading, empty and results states
- [ ] Mock API with loading and error states (React Query + Zod)
- [ ] Tests: filter rules, severity rendering, one axe check
- [ ] Accessibility audit notes
- [ ] Bundle size and decision log
