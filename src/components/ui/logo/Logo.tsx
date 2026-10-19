import { Icon } from '../Icon';
import styles from './Logo.module.scss';

export function Logo() {
  return (
    <span className={styles.logo}>
      <span className={styles.mark}>
        <Icon name="plane" size={22} />
      </span>
      <span className={styles.text}>
        <span className={styles.name}>Finchglow</span>
        <span className={styles.sub}>Holdings</span>
      </span>
    </span>
  );
}
