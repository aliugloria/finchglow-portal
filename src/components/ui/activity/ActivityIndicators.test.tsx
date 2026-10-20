import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { PortalProvider } from '@/providers/PortalProvider';
import { LauncherGrid } from '@/components/home/launcher/LauncherGrid';
import { NEWS } from '@/data/news';
import { NewsReadToggle } from './ActivityIndicators';

beforeEach(() => localStorage.clear());

it('updates the read control and badges an opened app without navigating the prototype', async () => {
  const user = userEvent.setup();
  render(<PortalProvider><LauncherGrid /><NewsReadToggle item={NEWS[0]} /></PortalProvider>);
  const unread = screen.getByRole('button', { name: `Mark ${NEWS[0].title} as read` });
  expect(unread).toHaveTextContent('Unread');
  await user.click(unread);
  expect(screen.getByRole('button', { name: `Mark ${NEWS[0].title} as unread` })).toHaveAttribute('aria-pressed', 'true');
  const app = screen.getByRole('link', { name: 'CRM' });
  await user.click(app);
  expect(app).toHaveTextContent('Recently used');
  expect(screen.getAllByText('Recently used')).toHaveLength(1);
  expect(screen.getAllByRole('link')[0]).toBe(app);
  const nextApp = screen.getByRole('link', { name: 'HR Self-Service' });
  await user.click(nextApp);
  expect(screen.getAllByRole('link')[0]).toBe(nextApp);
  expect(nextApp).toHaveTextContent('Recently used');
  expect(app).not.toHaveTextContent('Recently used');
  expect(screen.getAllByText('Recently used')).toHaveLength(1);
});
