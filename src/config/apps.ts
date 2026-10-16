import type { AppConfig, AppId } from '@/types';

export const APPS: AppConfig[] = [
  { id: 'booking-tools', name: 'Booking Tools', icon: 'plane', tone: 'blue', href: '#', companies: ['ota', 'b2b', 'tmc', 'holidays'] },
  { id: 'crm', name: 'CRM', icon: 'users', tone: 'green', href: '#', companies: 'all' },
  { id: 'supplier-portal', name: 'Supplier Portal', icon: 'package', tone: 'purple', href: '#', companies: ['ota', 'b2b', 'tmc', 'holidays'] },
  { id: 'learning-platform', name: 'Learning Platform', icon: 'graduation-cap', tone: 'blue', href: '#', companies: 'all' },
  { id: 'facilities-requests', name: 'Facilities Requests', icon: 'wrench', tone: 'orange', href: '#', companies: 'all' },
  { id: 'hr-self-service', name: 'HR Self-Service', icon: 'user', tone: 'red', href: '#', companies: 'all' },
];

export const APPS_BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a])) as Record<AppId, AppConfig>;
