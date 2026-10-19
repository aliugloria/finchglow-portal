export type CompanyId = 'group' | 'ota' | 'academy' | 'b2b' | 'tmc' | 'holidays' | 'facilities';
export type RoleId =
  | 'contact-centre-agent'
  | 'travel-consultant'
  | 'facilities-technician'
  | 'academy-trainer';
export type AppId =
  | 'booking-tools'
  | 'crm'
  | 'supplier-portal'
  | 'learning-platform'
  | 'facilities-requests'
  | 'hr-self-service';
export type Severity = 'critical' | 'warning' | 'info';
export type AppTone = 'blue' | 'green' | 'purple' | 'orange' | 'red';

export type IconKey =
  | 'bird'
  | 'briefcase'
  | 'building'
  | 'globe'
  | 'graduation-cap'
  | 'heart-pulse'
  | 'home'
  | 'grid'
  | 'bell'
  | 'network'
  | 'newspaper'
  | 'package'
  | 'plane'
  | 'sun'
  | 'user'
  | 'users'
  | 'wrench';

export interface CompanyTheme {
  /** Main brand colour. Must reach 4.5:1 against white. */
  accent: string;
  /** Darker shade: hero gradient end and text on tinted surfaces. */
  accentDark: string;
  /** Light tint for selected states and chips. */
  accentSoft: string;
  onAccent: string;
}

export interface CompanyConfig {
  id: CompanyId;
  name: string;
  shortName: string;
  description: string;
  portalTitle: string;
  icon: IconKey;
  theme: CompanyTheme;
  /** Optional hero photo in /public. Companies without one use the gradient. */
  bannerImage?: string;
}

export interface RoleConfig {
  id: RoleId;
  label: string;
  appIds: AppId[];
}

export interface AppConfig {
  id: AppId;
  name: string;
  icon: IconKey;
  tone: AppTone;
  href: string;
  /** 'all' or the companies that offer this app. */
  companies: 'all' | CompanyId[];
}

export interface Persona {
  id: string;
  name: string;
  initials: string;
  roleId: RoleId;
  companyId: CompanyId;
}

export type Scope = 'group' | 'company';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  scope: Scope;
  companyId?: CompanyId;
  minutesAgo: number;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  scope: Scope;
  companyId?: CompanyId;
  category: string;
  icon: IconKey;
  audience: 'internal' | 'external';
  publishedAt: string;
}

export type NewsFilter = 'all' | 'group' | 'internal' | 'external';
