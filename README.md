# Finchglow Group Staff Portal

**Live demo:** [finchglow-portal-prototype.vercel.app](https://finchglow-portal-prototype.vercel.app/)

A home-page prototype for staff across Finchglow Holdings' six businesses. It brings their tools, news and alerts into one place, with a shared layout that changes colour and content when a different business is selected.

The scope is the portal home experience. It uses mock staff and content, so there is no account setup or backend to run.

## Run locally

Use a Node.js version supported by Next.js 16 (20.9 or later) and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. For a production build with Webpack:

```bash
npm run build -- --webpack
npm start
```

```bash
npm test              # Run the tests once
npm run typecheck     # Check TypeScript
```

## Try the main flows

- Change business in the desktop header or the Business control in the phone/tablet bottom navigation. Colours, the portal title, apps and company content change. Group-wide alerts remain visible.
- Open the account menu to switch between a contact-centre agent, travel consultant, facilities technician and Academy trainer. Their launcher shortcuts differ.
- Search for `CRM`, `flight` or `wellbeing`. Search covers accessible apps, news and alerts. Try an unmatched word to see the empty state, and clear the field to return home.
- Acknowledge the critical payment alert. Its banner disappears, but the alert stays in the feed marked as acknowledged. View details opens the full message in a modal. Clicking any alert in the feed or search opens the same modal. Closing it preserves your search and does not acknowledge the alert.
- Use the news filters to see group-wide, internal and external content.
- News starts as unread. Select its Unread badge to mark it read, or Read to mark it unread again. The same status appears in search.
- Open an app tile to see its Recently used indicator. Only the last opened app has this badge and moves to the first position in the launcher and matching search results. The prototype shortcuts stay on the portal until real destination URLs are supplied.

Read news and recent apps are saved in this browser for each demo persona. Switching business keeps that person's activity, while switching persona shows their own history. Clearing site data resets it. If browser storage is unavailable, the indicators still work for the current visit.

External news uses selected Unsplash photos matched to each story: Dubai, a beach destination and a hotel lobby. Photos load lazily, include photographer credits and fall back to an icon if unavailable. Internal news keeps its icons. These are illustrative photos for mock stories; no Unsplash API key or live news service is needed.

To demonstrate failures, set `NEXT_PUBLIC_MOCK_FAIL_RATE=0.3` in `.env.local` and restart the dev server. Requests take about 500 ms and have a 30% chance of failing. Use `1` to force failure or `0` for a predictable walkthrough. Search also has a 250 ms typing debounce. This setting is public demo configuration, not a secret.

## How the app is organised

Next.js App Router and TypeScript provide the page and shared types. SCSS Modules keep component styles local; CSS variables carry each company's theme. Lucide supplies icons, and Radix handles the keyboard and focus behaviour of the dropdown menus.

| Location | Responsibility |
| --- | --- |
| `src/app` | Root layout and home/search composition |
| `src/components/layout` | Header, sidebar, mobile navigation and critical banner |
| `src/components/home` | Greeting, launcher, feeds and search results |
| `src/components/ui` | Shared controls, severity labels and loading/error displays |
| `src/config` | Companies, roles, apps and navigation |
| `src/data` | Mock staff, alerts and news |
| `src/lib` | Filtering, mock requests, search, formatting and theme helpers |
| `src/providers` | Selected company, demo user, search and alert acknowledgements |
| `src/styles` | Shared tokens, reset and breakpoint mixins |

The provider holds the small amount of state shared across the page. Feed requests use a small loading hook that ignores stale responses and offers retry. Visibility rules live in plain functions so they can be tested without rendering the interface.

To add a seventh subsidiary, add its company configuration and extend `CompanyId`, then assign its apps and mock content. No duplicated page or component is needed. The logo keeps the Finchglow name and changes its mark, business label and colours from the selected company configuration. The marks are prototype icons, rather than official subsidiary logo assets.

The three main trade-offs are in [DECISIONS.md](DECISIONS.md).

## Accessibility and checks

From 1024 px, the desktop sidebar collapses to an icon rail and expands on hover or keyboard focus. Below that, the portal uses bottom navigation. It includes a skip link, labelled controls, visible focus styles, text labels for severity, live status messages and reduced-motion support. Critical alerts use a sticky banner and `role="alert"`; they remain visible until acknowledged.

Manual checks covered keyboard navigation, modal dismissal and focus return, responsive layouts and visible severity labels. The automated suite checks company colour contrast, severity labels, filtering, search, loading and retry behaviour, critical-alert acknowledgement and shared alert details from the banner, feed and search. Axe checks cover the complete loaded page in both navigation layouts, plus the open alert modal. These automated checks do not measure the whole browser experience or replace the manual checks.

Validation on 20 October 2026: all 89 tests passed, TypeScript passed during the production build, and `npm run build -- --webpack` completed successfully. Desktop and mobile checks confirmed the external photos load without horizontal overflow; sidebar checks covered hover expansion, collapse and keyboard access.

## Performance

Measured on 20 October 2026 from the completed Webpack production build with `NEXT_PUBLIC_MOCK_FAIL_RATE=0`:

| Home-page asset | Minified / uncompressed | Gzip estimate |
| --- | --- | --- |
| Initial JavaScript (10 script files) | 739.4 KiB | 231.9 KiB |
| Stylesheets (3 files) | 31.1 KiB | 7.5 KiB |
| Default hero WebP | 67.1 KiB | Already image-compressed |

The JavaScript total includes the framework/runtime and the script files referenced by the generated home-page HTML. The legacy-browser `nomodule` polyfill is excluded. Gzip totals are the sum of each file compressed separately; actual transfer depends on the server's compression. These figures exclude HTML, inline page data, fonts and images, so they are not the total page download or a measured loading time.

To reproduce: run the Webpack build, inspect the script and stylesheet URLs in `.next/server/app/index.html`, then total the corresponding `.next/static` files and gzip each file separately. Do not use the development bundle for this measurement. The build uses static prerendering for the home page, locally bundled fonts, WebP hero backgrounds, named icon imports and no full UI component framework. Radix is limited to dropdowns. Alert details use the native HTML dialog for modal focus handling, with Framer Motion easing the entrance and exit. Reduced-motion preferences disable these transitions. Search is debounced to avoid a request on every keystroke.

These choices keep the prototype straightforward, but there is still work to do for slow connections. All mock data is bundled with the client. The font package includes multiple language subsets, and the original PNG hero files are still in `public` even though the page uses WebP. A next pass would limit font subsets, remove unused originals and check real mobile loading performance before setting a budget.

## Sign-in in a real deployment

The demo persona menu would be replaced by OIDC single sign-on. A server-side session would supply the employee's name, company and role from verified identity claims. Tokens would stay in secure httpOnly cookies, with secrets supplied by the deployment environment. The backend must enforce app and content permissions; hiding a shortcut in the browser is not access control.

## What is intentionally left out

App tiles use placeholder links. The brief asks for a launcher grid and does not require building booking, CRM, HR or other destination systems. There are no additional tool pages, real login, live notifications or persistent acknowledgements. Refreshing resets the demo user, business and acknowledged alerts.

The role-based view is the chosen extra. Dark mode and offline caching were left out to keep the prototype focused. A failed request shows a retry state, but previously loaded alerts are not cached for offline use.

## With another week

First, replace the prototype brand marks with approved subsidiary logos and replace placeholder app URLs with agreed destinations. Then connect real identity and content endpoints, persist acknowledgements and validate permissions on the server. For staff on patchy Wi-Fi, add cached alerts with a clear offline/stale indicator and define how urgent updates are delivered when connectivity returns.

Alongside that, test the complete flows with a screen reader and representative staff, tighten the font and image payload, and measure loading on a slow mobile connection. Useful success measures would be time to open a needed tool, search success, critical-alert acknowledgement time, and loading/error rates by device and connection.
