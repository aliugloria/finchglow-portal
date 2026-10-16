import {
  Bell,
  Bird,
  Briefcase,
  Building2,
  GraduationCap,
  Globe,
  HeartPulse,
  House,
  LayoutGrid,
  Network,
  Newspaper,
  Package,
  Plane,
  Sun,
  UserRound,
  Users,
  Wrench,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { IconKey } from '@/types';

const ICONS: Record<IconKey, ComponentType<LucideProps>> = {
  bell: Bell,
  bird: Bird,
  briefcase: Briefcase,
  building: Building2,
  globe: Globe,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  home: House,
  grid: LayoutGrid,
  network: Network,
  newspaper: Newspaper,
  package: Package,
  plane: Plane,
  sun: Sun,
  user: UserRound,
  users: Users,
  wrench: Wrench,
};

/** One place that maps config icon keys to lucide icons. Decorative by default. */
export function Icon({ name, ...props }: { name: IconKey } & LucideProps) {
  const Component = ICONS[name];
  return <Component aria-hidden="true" focusable="false" {...props} />;
}
