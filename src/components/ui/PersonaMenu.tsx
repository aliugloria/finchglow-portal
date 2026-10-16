'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';
import { ROLES_BY_ID } from '@/config/roles';
import { PERSONAS } from '@/data/personas';
import { usePortal } from '@/providers/PortalProvider';
import styles from './PersonaMenu.module.scss';

/**
 * Demo-only "sign in as" switcher. In production the user object
 * (name, company, role) comes from the SSO provider's claims.
 */
export function PersonaMenu() {
  const { persona, setPersonaId } = usePortal();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={styles.trigger} aria-label={`Account menu for ${persona.name}`}>
        <span className={styles.avatar}>{persona.initials}</span>
        <ChevronDown aria-hidden="true" size={16} className={styles.chevron} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={styles.content} align="end" sideOffset={8}>
        <DropdownMenu.Label className={styles.label}>Demo: sign in as</DropdownMenu.Label>
        <DropdownMenu.RadioGroup value={persona.id} onValueChange={setPersonaId}>
          {PERSONAS.map((p) => (
            <DropdownMenu.RadioItem key={p.id} value={p.id} className={styles.item}>
              <span className={styles.avatar}>{p.initials}</span>
              <span className={styles.text}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.role}>{ROLES_BY_ID[p.roleId].label}</span>
              </span>
              <DropdownMenu.ItemIndicator className={styles.check}>
                <Check aria-hidden="true" size={18} />
              </DropdownMenu.ItemIndicator>
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
        <p className={styles.note}>Demo only. Production sign-in would use single sign-on.</p>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
