import type { Persona } from '@/types';

/** Stand-ins for the user object an SSO provider would return. */
export const PERSONAS: Persona[] = [
  { id: 'gloria', name: 'Gloria Aliu', initials: 'GA', roleId: 'contact-centre-agent', companyId: 'ota' },
  { id: 'tunde', name: 'Tunde Bello', initials: 'TB', roleId: 'travel-consultant', companyId: 'b2b' },
  { id: 'chidi', name: 'Chidi Okafor', initials: 'CO', roleId: 'facilities-technician', companyId: 'facilities' },
  { id: 'amaka', name: 'Amaka Eze', initials: 'AE', roleId: 'academy-trainer', companyId: 'academy' },
];

export const PERSONAS_BY_ID = Object.fromEntries(PERSONAS.map((p) => [p.id, p])) as Record<string, Persona>;
