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
import HomePage from '@/app/page';
import { SearchField } from '@/components/ui/search/SearchField';
import { AlertDetailsModal } from '@/components/ui/alert-details/AlertDetailsModal';

// Replace the slow, failure-prone mock API with instant answers.
vi.mock('@/lib/api', () => ({ fetchAlerts: vi.fn(), fetchNews: vi.fn() }));

function renderPortal() {
  return render(
    <PortalProvider>
      <CriticalBanner />
      <LauncherGrid />
      <AlertsCard />
      <NewsCard />
      <AlertDetailsModal />
    </PortalProvider>,
  );
}

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
  vi.mocked(fetchAlerts).mockReset().mockResolvedValue(ALERTS);
  vi.mocked(fetchNews).mockReset().mockResolvedValue(NEWS);
});

describe('critical alert banner', () => {
  it('opens critical details during search without clearing the query', async () => {
    const user = userEvent.setup();
    render(
      <PortalProvider>
        <CriticalBanner />
        <SearchField />
        <HomePage />
        <AlertDetailsModal />
      </PortalProvider>,
    );
    const banner = await screen.findByRole('alert');
    const search = screen.getByRole('textbox', { name: 'Search apps, news and alerts' });
    await user.type(search, 'crm');
    expect(document.getElementById('alerts')).toBeNull();

    const details = within(banner).getByRole('button', { name: 'View details' });
    await user.click(details);

    const dialog = screen.getByRole('dialog', { name: ALERTS[0].title });
    expect(within(dialog).getByText(ALERTS[0].description)).toBeInTheDocument();
    expect(search).toHaveValue('crm');
    await user.click(within(dialog).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: /Results for/ })).toBeInTheDocument();
    expect(banner).toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: `View alert: ${ALERTS[2].title}` }));
    expect(within(screen.getByRole('dialog')).getByText(ALERTS[2].description)).toBeInTheDocument();
    expect(search).toHaveValue('crm');
  });

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

describe('shared alert details', () => {
  it.each(['a1', 'a2', 'a3'])('opens the matching details for feed alert %s', async (id) => {
    const user = userEvent.setup();
    renderPortal();
    const alert = ALERTS.find((item) => item.id === id)!;
    const trigger = await screen.findByRole('button', { name: `View alert: ${alert.title}` });
    trigger.focus();
    await user.keyboard('{Enter}');

    const dialog = screen.getByRole('dialog', { name: alert.title });
    expect(within(dialog).getByText(alert.description)).toBeInTheDocument();
    expect(within(dialog).getByText(id === 'a2' ? 'OTA' : 'Group-wide')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    await user.click(within(dialog).getByRole('button', { name: 'Close alert details' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(document.body.style.overflow).not.toBe('hidden'));
  });

  it('keeps acknowledged alerts readable in the same dialog', async () => {
    const user = userEvent.setup();
    renderPortal();
    const banner = await screen.findByRole('alert');
    await user.click(within(banner).getByRole('button', { name: 'Acknowledge' }));
    await user.click(screen.getByRole('button', { name: `View alert: ${ALERTS[0].title}` }));
    expect(within(screen.getByRole('dialog')).getByText('You have acknowledged this alert.')).toBeInTheDocument();
  });

  it('has no detectable axe violations when the dialog is open', async () => {
    const user = userEvent.setup();
    const { container } = renderPortal();
    await user.click(await screen.findByRole('button', { name: `View alert: ${ALERTS[0].title}` }));
    const results = await axe(container, { rules: { region: { enabled: false } } });
    expect(results.violations).toEqual([]);
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
