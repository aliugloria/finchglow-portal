import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ALERTS } from '@/data/alerts';
import { fetchAlerts } from '@/lib/api';
import { PortalProvider } from '@/providers/PortalProvider';
import { Sidebar } from './Sidebar';

vi.mock('@/lib/api', () => ({ fetchAlerts: vi.fn() }));

beforeEach(() => { vi.mocked(fetchAlerts).mockResolvedValue(ALERTS); });

function renderSidebar() {
  return render(<PortalProvider><Sidebar /></PortalProvider>);
}

describe('collapsible sidebar', () => {
  it('keeps navigation accessible when labels are collapsed', async () => {
    const { container } = renderSidebar();
    expect(container.querySelector('aside')).toHaveAttribute('data-expanded', 'false');
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#main');
    expect(await screen.findByRole('link', { name: 'Alert & News, 5 active alerts' })).toHaveAttribute('href', '#alerts');
    expect(screen.queryByRole('link', { name: 'News' })).not.toBeInTheDocument();
  });

  it('expands on hover and collapses when the pointer leaves', async () => {
    const user = userEvent.setup();
    const { container } = renderSidebar();
    const sidebar = container.querySelector('aside')!;
    await user.hover(sidebar);
    expect(sidebar).toHaveAttribute('data-expanded', 'true');
    await user.unhover(sidebar);
    expect(sidebar).toHaveAttribute('data-expanded', 'false');
  });

  it('stays expanded while keyboard focus moves between links and closes on leaving', async () => {
    const user = userEvent.setup();
    const { container } = renderSidebar();
    const sidebar = container.querySelector('aside')!;
    await user.tab();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();
    expect(sidebar).toHaveAttribute('data-expanded', 'true');
    await user.tab();
    expect(screen.getByRole('link', { name: 'Apps' })).toHaveFocus();
    expect(sidebar).toHaveAttribute('data-expanded', 'true');
    await user.tab();
    await user.tab();
    expect(sidebar).toHaveAttribute('data-expanded', 'false');
  });
});
