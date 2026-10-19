# Finchglow Group Staff Portal

A home-page prototype for staff across Finchglow Holdings' six businesses. It brings their tools, news and alerts into one place, with a shared layout that changes colour and content when a different business is selected.

The scope is the portal home experience. It uses mock staff and content, so there is no account setup or backend to run.

## Run locally

Use a Node.js version supported by Next.js 16 (20.9 or later) and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. For a production build:

```bash
npm run build
npm start
```

The build was also verified with `npm run build -- --webpack`. The default Turbopack build did not finish during the review, so the recorded bundle figures below use Webpack.

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

To add a seventh subsidiary, add its company configuration and extend `CompanyId`, then assign its apps and mock content. No duplicated page or component is needed. The current logo retains the group name and plane mark; only its colours change. Distinct company logos are a remaining branding detail.

The three main trade-offs are in [DECISIONS.md](DECISIONS.md).

## Accessibility and checks

The layout uses a desktop sidebar from 1024 px and bottom navigation below that. It includes a skip link, labelled controls, visible focus styles, text labels for severity, live status messages and reduced-motion support. Critical alerts use a sticky banner and `role="alert"`; they remain visible until acknowledged.

Manual accessibility checks found no issues. The automated suite checks company colour contrast, severity labels, filtering, search, loading and retry behaviour, critical-alert acknowledgement and shared alert details from the banner, feed and search. The axe check covers the loaded launcher and feeds with the banner; it does not measure the whole browser experience or replace the manual checks.

Validation on 19 October 2026: all 63 tests passed, TypeScript passed during the production build, and `npm run build -- --webpack` completed successfully.

## Performance

Measured on 19 October 2026 from the completed Webpack production build:

| Home-page asset | Minified / uncompressed | Gzip estimate |
| --- | --- | --- |
| Initial JavaScript (8 script files) | 640.0 KiB | 198.6 KiB |
| Stylesheets (3 files) | 29.2 KiB | 7.0 KiB |
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

First, finish company-specific logo configuration and replace placeholder app URLs with agreed destinations. Then connect real identity and content endpoints, persist acknowledgements and validate permissions on the server. For staff on patchy Wi-Fi, add cached alerts with a clear offline/stale indicator and define how urgent updates are delivered when connectivity returns.

Alongside that, test the complete flows with a screen reader and representative staff, tighten the font and image payload, and measure loading on a slow mobile connection. Useful success measures would be time to open a needed tool, search success, critical-alert acknowledgement time, and loading/error rates by device and connection.

For the interview, a live demo is enough. [PRESENTATION.md](PRESENTATION.md) gives a 20-minute walkthrough outline and the questions to rehearse.
