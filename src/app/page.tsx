'use client';
import { AlertsCard } from "@/components/home/alerts/AlertsCard";
import { Hero } from "@/components/home/hero/Hero";
import { LauncherGrid } from "@/components/home/launcher/LauncherGrid";
import { NewsCard } from "@/components/home/news/NewsCard";
import styles from "./page.module.scss";
import { usePortal } from "@/providers/PortalProvider";
import { SearchResults } from "@/components/home/search-result/SearchResults";

export default function HomePage() {
  const { query } = usePortal();

  if (query.trim()) return <SearchResults />;

  return (
    <>
      <Hero />
      <LauncherGrid />
      <div className={styles.feeds}>
        <AlertsCard />
        <NewsCard />
      </div>
    </>
  );
}
