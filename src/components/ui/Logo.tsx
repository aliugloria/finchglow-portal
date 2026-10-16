import { Icon } from './Icon';
import styles from './Logo.module.scss';

/** Placeholder wordmark. Swap the mark for the real SVG when available. */
export function Logo() {
  return (
    <span className={styles.logo}>
      <span className={styles.mark}>
        <Icon name="bird" size={22} />
      </span>
      <span className={styles.text}>
        <span className={styles.name}>Finchglow</span>
        <span className={styles.sub}>Holdings</span>
      </span>
    </span>
  );
}
