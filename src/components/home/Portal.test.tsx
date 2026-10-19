import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ALERTS } from '@/data/alerts';
import { NEWS } from '@/data/news';
import { PortalProvider } from '@/providers/PortalProvider';
import { CriticalBanner } from '../layout/critical-banner/CriticalBanner';
import { LauncherGrid } from './launcher/LauncherGrid';
import { AlertsCard } from './alerts/AlertsCard';
import { NewsCard } from './news/NewsCard';
import { fetchAlerts, fetchNews } from '@/lib/api';
 

// Replace the slow, failure-prone mock API with instant answers.
vi.mock('@/lib/api', () => ({ fetchAlerts: vi.fn(), fetchNews: vi.fn() }));

function renderPortal() {
  return render(
    <PortalProvider>
      <CriticalBanner />
      <LauncherGrid />
      <AlertsCard />
      <NewsCard />
    </PortalProvider>,
  );
}

beforeEach(() => {
  vi.mocked(fetchAlerts).mockReset().mockResolvedValue(ALERTS);
  vi.mocked(fetchNews).mockReset().mockResolvedValue(NEWS);
});

describe('critical alert banner', () => {
  it('shows the critical alert and only goes away once acknowledged', async () => {
    const user = userEvent.setup();
    renderPortal();

    const banner = await screen.findByRole('alert');
    expect(banner).toHaveTextContent('Payment gateway failure');

    await user.click(within(banner).getByRole('button', { name: 'Acknowledge' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    // The alert stays in the feed, marked as acknowledged.
    expect(screen.getByText('Acknowledged')).toBeInTheDocument();
  });
});

describe('loading and error states', () => {
  it('shows a loading message first, then the alerts', async () => {
    renderPortal();
    expect(screen.getByText('Loading alerts')).toBeInTheDocument();
    expect(await screen.findByText('Flight supplier delay')).toBeInTheDocument();
  });

  it('shows an error with a retry when alerts fail, then recovers', async () => {
    const user = userEvent.setup();
    vi.mocked(fetchAlerts).mockRejectedValueOnce(new Error('boom'));
    renderPortal();

    expect(await screen.findByText('Alerts couldn\u2019t load')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Try again' })[0]);
    expect(await screen.findByText('Flight supplier delay')).toBeInTheDocument();
  });

  it('reloads the news (and shows loading) when a filter is toggled', async () => {
    const user = userEvent.setup();
    renderPortal();
    await screen.findByText('Wellbeing week next month');

    // Hold the next request open so the loading state can be observed.
    let finish: (items: typeof NEWS) => void = () => {};
    vi.mocked(fetchNews).mockReturnValueOnce(new Promise((resolve) => (finish = resolve)));

    await user.click(screen.getByRole('button', { name: 'Group-wide' }));
    expect(screen.getByText('Loading news')).toBeInTheDocument();
    expect(fetchNews).toHaveBeenLastCalledWith('group', 'group');
    expect(screen.getByRole('button', { name: 'Group-wide' })).toHaveAttribute('aria-pressed', 'true');

    finish(NEWS.filter((n) => n.scope === 'group'));
    await waitFor(() => expect(screen.queryByText('Loading news')).not.toBeInTheDocument());
  });
});

describe('accessibility', () => {
  it('has no detectable axe violations once loaded', async () => {
    const { container } = renderPortal();
    await screen.findByText('Flight supplier delay');
    await screen.findByText('Wellbeing week next month');
    // Colour contrast cannot be measured in jsdom; contrast.test.ts covers the tokens.
    const results = await axe(container, { rules: { region: { enabled: false } } });
    expect(results.violations).toEqual([]);
  });
});
