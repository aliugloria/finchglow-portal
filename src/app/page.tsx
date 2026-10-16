import { AlertsCard } from '@/components/home/AlertsCard';
import { Hero } from '@/components/home/Hero';
import { LauncherGrid } from '@/components/home/LauncherGrid';
import { NewsCard } from '@/components/home/NewsCard';
import styles from './page.module.scss';

export default function HomePage() {
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
