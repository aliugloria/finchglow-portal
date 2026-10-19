import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SeverityBadge } from './severity/SeverityBadge';
// import { SeverityBadge } from '@/components/ui/SeverityBadge';

describe('SeverityBadge', () => {
  it.each([
    ['critical', 'Critical'],
    ['warning', 'Warning'],
    ['info', 'Info'],
  ] as const)('shows a text label for %s, so colour is never the only signal', (severity, label) => {
    render(<SeverityBadge severity={severity} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
