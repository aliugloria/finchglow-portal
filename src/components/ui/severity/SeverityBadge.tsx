import {
  CircleAlert,
  Info,
  TriangleAlert,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";
import type { Severity } from "@/types";
import styles from "./SeverityBadge.module.scss";

export const SEVERITY_META: Record<
  Severity,
  { label: string; Icon: ComponentType<LucideProps> }
> = {
  critical: { label: "Critical", Icon: CircleAlert },
  warning: { label: "Warning", Icon: TriangleAlert },
  info: { label: "Info", Icon: Info },
};

export function SeverityIcon({
  severity,
  size = 20,
}: {
  severity: Severity;
  size?: number;
}) {
  const { Icon } = SEVERITY_META[severity];
  return <Icon aria-hidden="true" size={size} />;
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={styles.badge} data-severity={severity}>
      {SEVERITY_META[severity].label}
    </span>
  );
}
