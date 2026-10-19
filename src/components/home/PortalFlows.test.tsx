import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import HomePage from '@/app/page';
import { AppShell } from '@/components/layout/appshell/AppShell';
import { PortalProvider } from '@/providers/PortalProvider';

vi.mock('@/lib/mock', () => ({ simulateNetwork: vi.fn().mockResolvedValue(undefined) }));

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
});
afterEach(() => vi.unstubAllGlobals());

async function renderHome() {
  const view = render(<PortalProvider><AppShell><HomePage /></AppShell></PortalProvider>);
  await screen.findByText('Wellbeing week next month');
  await screen.findByRole('button', { name: 'View alert: System maintenance' });
  return view;
}

describe('company and staff journeys', () => {
  it.each([
    ['Academy', 'Academy', 4, 3, 'New trainer cohort starts Monday'],
    ['OTA', 'OTA', 6, 3, 'Flight supplier delay'],
    ['Holidays', 'Holidays', 6, 3, 'Hotel partner availability reduced'],
    ['B2B Platform', 'B2B', 6, 2, 'System maintenance'],
    ['TMC', 'TMC', 6, 2, 'System maintenance'],
    ['Shared Facilities', 'Facilities', 4, 2, 'System maintenance'],
  ] as const)('switches branding and content for %s while retaining group alerts', async (name, brand, appCount, alertCount, localAlert) => {
    const user = userEvent.setup();
    await renderHome();
    const header = screen.getByRole('banner');
    await user.click(within(header).getByRole('button', { name: 'Business: Group-wide. Change business' }));
    await user.click(screen.getByRole('menuitemradio', { name: new RegExp(`^${name}`) }));

    expect(within(header).getByRole('button', { name: `Business: ${name}. Change business` })).toBeInTheDocument();
    expect(within(header).getByText('Finchglow').parentElement).toHaveTextContent(`Finchglow${brand}`);
    expect(within(screen.getByRole('region', { name: 'Your apps' })).getAllByRole('link')).toHaveLength(appCount);
    const alerts = screen.getByRole('region', { name: 'Alerts' });
    expect(within(alerts).getAllByRole('button')).toHaveLength(alertCount);
    expect(within(alerts).getByRole('button', { name: `View alert: ${localAlert}` })).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Payment gateway failure');
    await screen.findByText('Wellbeing week next month');
    if (name !== 'OTA') expect(screen.queryByText('New route launched: Lagos to Dubai')).not.toBeInTheDocument();
  });

  it.each([
    ['Gloria Aliu', 'Gloria', 6],
    ['Tunde Bello', 'Tunde', 5],
    ['Chidi Okafor', 'Chidi', 3],
    ['Amaka Eze', 'Amaka', 3],
  ] as const)('shows the greeting and shortcuts for %s', async (name, firstName, count) => {
    const user = userEvent.setup();
    await renderHome();
    await user.click(screen.getByRole('button', { name: 'Account menu for Gloria Aliu' }));
    await user.click(screen.getByRole('menuitemradio', { name: new RegExp(name) }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(firstName);
    expect(within(screen.getByRole('region', { name: 'Your apps' })).getAllByRole('link')).toHaveLength(count);
  });
});

describe('search and page accessibility', () => {
  it('clears an empty search and returns focus to the search field', async () => {
    const user = userEvent.setup();
    await renderHome();
    const input = screen.getByRole('textbox', { name: 'Search apps, news and alerts' });
    await user.type(input, 'zzzz-no-match');
    const empty = await screen.findByRole('heading', { name: 'No results found' });
    await user.click(within(empty.parentElement!).getByRole('button', { name: 'Clear search' }));
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(screen.getByRole('region', { name: 'Your apps' })).toBeInTheDocument();
  });

  it('finds news, filters result types and returns home through navigation', async () => {
    const user = userEvent.setup();
    await renderHome();
    const input = screen.getByRole('textbox', { name: 'Search apps, news and alerts' });
    await user.type(input, 'wellbeing');
    await screen.findByText('Wellbeing week next month');
    expect(screen.getByRole('status')).toHaveTextContent('1 result');
    await user.click(screen.getByRole('button', { name: 'Apps' }));
    expect(screen.getByRole('heading', { name: 'No results found' })).toBeInTheDocument();
    await user.click(within(screen.getAllByRole('navigation', { name: 'Primary' })[0]).getByRole('link', { name: 'Home' }));
    expect(input).toHaveValue('');
    expect(screen.getByRole('region', { name: 'Your apps' })).toBeInTheDocument();
  });

  it('has no detectable axe violations across the complete loaded page', async () => {
    const { container } = await renderHome();
    await waitFor(() => expect(screen.queryByText('Loading news')).not.toBeInTheDocument());
    // jsdom does not apply responsive SCSS; check each navigation layout separately.
    const [desktopNav, mobileNav] = screen.getAllByRole('navigation', { name: 'Primary' });
    mobileNav.setAttribute('hidden', '');
    expect((await axe(container)).violations).toEqual([]);
    desktopNav.setAttribute('hidden', '');
    mobileNav.removeAttribute('hidden');
    expect((await axe(container)).violations).toEqual([]);
  });
});
