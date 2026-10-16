import type { Metadata } from 'next';
import '@fontsource-variable/plus-jakarta-sans';
import '@/styles/globals.scss';
import { AppShell } from '@/components/layout/AppShell';
import { PortalProvider } from '@/providers/PortalProvider';

export const metadata: Metadata = {
  title: 'Finchglow Group Staff Portal',
  description: 'One front door to news, alerts and the tools you need across Finchglow Holdings.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PortalProvider>
          <AppShell>{children}</AppShell>
        </PortalProvider>
      </body>
    </html>
  );
}
