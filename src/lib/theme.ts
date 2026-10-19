import type { CSSProperties } from 'react';
import type { CompanyConfig } from '@/types';

export function themeStyle({ theme }: CompanyConfig): CSSProperties {
  return {
    '--accent': theme.accent,
    '--accent-dark': theme.accentDark,
    '--accent-soft': theme.accentSoft,
    '--on-accent': theme.onAccent,
  } as CSSProperties;
}
