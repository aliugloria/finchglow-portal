"use client";

import { CSSProperties, useEffect, useState } from "react";
import { COMPANIES_BY_ID } from "@/config/companies";
import { Icon } from "@/components/ui/Icon";
import { getGreeting } from "@/lib/format";
import { usePortal } from "@/providers/PortalProvider";
import styles from "./Hero.module.scss";
import { cx } from "@/lib/cx";

export function Hero() {
  const { persona, role, company } = usePortal();
  const [greeting, setGreeting] = useState("Hello");

  // Read the clock after mount so server and client markup match.
  useEffect(() => setGreeting(getGreeting(new Date().getHours())), []);

  const employerName = COMPANIES_BY_ID[persona.companyId].name;
  const firstName = persona.name.split(" ")[0];

  return (
    <section
      className={cx(styles.hero, company.bannerImage && styles.withImage)}
      style={
        {
          "--hero-image": company.bannerImage && `url(${company.bannerImage})`,
        } as CSSProperties
      }
      aria-labelledby="greeting"
    >
      <h1 id="greeting" className={styles.title}>
        {greeting}, {firstName}
      </h1>
      <p className={styles.lead}>Welcome to the {company.portalTitle}.</p>
      <ul className={styles.chips}>
        <li className={styles.chip}>
          <Icon name={COMPANIES_BY_ID[persona.companyId].icon} size={16} />
          <span>
            <span className="sr-only">Your company: </span>
            {employerName}
          </span>
        </li>
        <li className={styles.chip}>
          <Icon name="user" size={16} />
          <span>
            <span className="sr-only">Your role: </span>
            {role.label}
          </span>
        </li>
      </ul>
    </section>
  );
}
