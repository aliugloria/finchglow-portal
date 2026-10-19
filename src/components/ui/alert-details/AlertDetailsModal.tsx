'use client';

import { useEffect, useRef } from 'react';
import { useAnimate, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { COMPANIES_BY_ID } from '@/config/companies';
import { formatAgo } from '@/lib/format';
import { usePortal } from '@/providers/PortalProvider';
import { SeverityBadge } from '@/components/ui/severity/SeverityBadge';
import styles from './AlertDetailsModal.module.scss';

export function AlertDetailsModal() {
  const { selectedAlert: alert, closeAlert, acknowledged } = usePortal();
  const [dialogRef, animate] = useAnimate<HTMLDialogElement>();
  const reduceMotion = useReducedMotion();
  const closing = useRef(false);

  useEffect(() => {
    if (!alert) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [alert]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (alert && !dialog.open) {
      closing.current = false;
      dialog.showModal();
      void animate(dialog, {
        opacity: [0, 1],
        y: [reduceMotion ? 0 : 16, 0],
        scale: [reduceMotion ? 1 : 0.97, 1],
      }, { duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] });
    }
    if (!alert && dialog.open) dialog.close();
  }, [alert, animate, dialogRef, reduceMotion]);

  const dismiss = async () => {
    const dialog = dialogRef.current;
    if (!dialog || closing.current) return;
    closing.current = true;
    await animate(dialog, {
      opacity: 0,
      y: reduceMotion ? 0 : 8,
      scale: reduceMotion ? 1 : 0.98,
    }, { duration: reduceMotion ? 0 : 0.16, ease: 'easeIn' });
    dialog.close();
    closeAlert();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="alert-details-title"
      aria-describedby="alert-details-message"
      onCancel={(event) => {
        event.preventDefault();
        void dismiss();
      }}
      onClose={closeAlert}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) void dismiss();
      }}
    >
      {alert && (
        <>
          <div className={styles.header}>
            <span className={styles.eyebrow}>Alert details</span>
            <button type="button" className={styles.iconButton} aria-label="Close alert details" onClick={() => void dismiss()} autoFocus>
              <X aria-hidden="true" size={22} />
            </button>
          </div>
          <h2 id="alert-details-title" className={styles.title}>{alert.title}</h2>
          <div className={styles.meta}>
            <SeverityBadge severity={alert.severity} />
            <span>{alert.scope === 'group' ? 'Group-wide' : COMPANIES_BY_ID[alert.companyId ?? 'group'].name}</span>
            <span>{formatAgo(alert.minutesAgo)}</span>
          </div>
          <p id="alert-details-message" className={styles.message}>{alert.description}</p>
          {acknowledged.has(alert.id) && <p className={styles.acknowledged}>You have acknowledged this alert.</p>}
          <div className={styles.footer}>
            <button type="button" className={styles.closeButton} onClick={() => void dismiss()}>Close</button>
          </div>
        </>
      )}
    </dialog>
  );
}
