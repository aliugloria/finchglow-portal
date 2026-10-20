import type { Metadata } from 'next';
import '@fontsource-variable/plus-jakarta-sans';
import '@/styles/globals.scss';
import { PortalProvider } from '@/providers/PortalProvider';
import { AppShell } from '@/components/layout/appshell/AppShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://finchglow-portal-prototype.vercel.app'),
  title: 'Finchglow Group Staff Portal',
  description: 'One front door to news, alerts and the tools you need across Finchglow Holdings.',
  applicationName: 'Finchglow Group Staff Portal',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: '/',
    siteName: 'Finchglow Group Staff Portal',
    title: 'Finchglow Group Staff Portal',
    description: 'One front door to news, alerts and the tools you need across Finchglow Holdings.',
    images: [{
      url: '/og-image.webp',
      width: 1200,
      height: 630,
      alt: 'Finchglow Group Staff Portal — one portal for every Finchglow team.',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finchglow Group Staff Portal',
    description: 'One front door to news, alerts and the tools you need across Finchglow Holdings.',
    images: ['/og-image.webp'],
  },
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
