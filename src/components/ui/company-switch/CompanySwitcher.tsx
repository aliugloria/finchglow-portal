'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';
import { COMPANIES } from '@/config/companies';
import { usePortal } from '@/providers/PortalProvider';
import type { CompanyId } from '@/types';
import { Icon } from '../Icon';
import styles from './CompanySwitcher.module.scss';

export function CompanySwitcher({ placement = 'header' }: { placement?: 'header' | 'bottom-nav' }) {
  const { company, setCompanyId } = usePortal();
  const inBottomNav = placement === 'bottom-nav';

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className={inBottomNav ? styles.mobileTrigger : styles.trigger} aria-label={`Business: ${company.name}. Change business`}>
        <Icon name={company.icon} size={inBottomNav ? 24 : 18} />
        <span className={inBottomNav ? styles.mobileLabel : styles.name}>{inBottomNav ? 'Business' : company.shortName}</span>
        {!inBottomNav && <ChevronDown aria-hidden="true" size={16} />}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={styles.content} align={inBottomNav ? 'center' : 'start'} side={inBottomNav ? 'top' : 'bottom'} sideOffset={8} collisionPadding={12}>
        <DropdownMenu.Label className={styles.label}>Switch business</DropdownMenu.Label>
        <DropdownMenu.RadioGroup value={company.id} onValueChange={(id) => setCompanyId(id as CompanyId)}>
          {COMPANIES.map((c) => (
            <DropdownMenu.RadioItem key={c.id} value={c.id} className={styles.item}>
              <Icon name={c.icon} size={20} />
              <span className={styles.text}>
                <span className={styles.itemName}>{c.name}</span>
                <span className={styles.itemDesc}>{c.description}</span>
              </span>
              <DropdownMenu.ItemIndicator className={styles.check}>
                <Check aria-hidden="true" size={18} />
              </DropdownMenu.ItemIndicator>
            </DropdownMenu.RadioItem>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
