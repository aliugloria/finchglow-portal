import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NEWS } from '@/data/news';
import { NewsThumbnail } from './NewsThumbnail';

const external = NEWS.find((item) => item.id === 'n1')!;
const internal = NEWS.find((item) => item.id === 'n2')!;

describe('news photos', () => {
  it('shows an accessible, lazy-loaded external photo with photographer and source credits', () => {
    render(<NewsThumbnail item={external} />);
    expect(screen.getByRole('img', { name: external.image!.alt })).toHaveAttribute('loading', 'lazy');
    const source = screen.getByRole('link', { name: `Photo by ${external.image!.photographer} on Unsplash (opens in a new tab)` });
    expect(source).toHaveAttribute('href', external.image!.sourceUrl);
    expect(source).toHaveAttribute('title', `Photo by ${external.image!.photographer} on Unsplash`);
  });

  it('keeps internal news as icons without photo credits', () => {
    const { container } = render(<NewsThumbnail item={internal} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('falls back to an icon on image failure and can display a different photo afterward', () => {
    const { container, rerender } = render(<NewsThumbnail item={external} />);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
    const beach = NEWS.find((item) => item.id === 'n4')!;
    rerender(<NewsThumbnail item={beach} />);
    expect(screen.getByRole('img', { name: beach.image!.alt })).toBeInTheDocument();
  });
});
