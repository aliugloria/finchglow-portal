import type { IconKey } from '@/types';

/** The portal home is one page, so nav items jump to its sections. */
export interface NavItem {
  id: 'home' | 'apps' | 'alerts' | 'news';
  label: string;
  href: string;
  icon: IconKey;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '#main', icon: 'home' },
  { id: 'apps', label: 'Apps', href: '#apps', icon: 'grid' },
  { id: 'alerts', label: 'Alerts', href: '#alerts', icon: 'bell' },
  { id: 'news', label: 'News', href: '#news', icon: 'newspaper' },
];
