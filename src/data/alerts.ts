import type { Alert } from '@/types';

export const ALERTS: Alert[] = [
  {
    id: 'a1',
    title: 'Payment gateway failure: bookings affected',
    description: 'The payment gateway is currently experiencing issues. Bookings may fail or be delayed.',
    severity: 'critical',
    scope: 'group',
    minutesAgo: 120,
  },
  {
    id: 'a2',
    title: 'Flight supplier delay',
    description: 'Some flight itineraries to London are experiencing delays.',
    severity: 'warning',
    scope: 'company',
    companyId: 'ota',
    minutesAgo: 300,
  },
  {
    id: 'a3',
    title: 'System maintenance',
    description: 'CRM will be temporarily unavailable tonight (10:00 PM to 1:00 AM).',
    severity: 'info',
    scope: 'group',
    minutesAgo: 420,
  },
  {
    id: 'a4',
    title: 'Hotel partner availability reduced',
    description: 'Several partner hotels are showing limited inventory for December packages.',
    severity: 'warning',
    scope: 'company',
    companyId: 'holidays',
    minutesAgo: 540,
  },
  {
    id: 'a5',
    title: 'New trainer cohort starts Monday',
    description: 'Room allocations are confirmed. Check the learning platform for your schedule.',
    severity: 'info',
    scope: 'company',
    companyId: 'academy',
    minutesAgo: 1500,
  },
];
