import { WifiOff } from "lucide-react";
import styles from "./FeedState.module.scss";

export function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={styles.row}>
          <span className={styles.icon} />
          <span className={styles.lines}>
            <span />
            <span />
          </span>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({
  title,
  onRetry,
}: {
  title: string;
  onRetry: () => void;
}) {
  return (
    <div className={styles.error}>
      <WifiOff aria-hidden="true" size={28} />
      <p className={styles.errorTitle}>{title}</p>
      <p>Check your connection and try again.</p>
      <button type="button" className={styles.retry} onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
