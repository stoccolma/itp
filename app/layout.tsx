'use client';

import './globals.css';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { PlannerProvider } from '@/contexts/PlannerContext';
import { StickyNav } from '@/components/StickyNav';
import { StagingBanner } from '@/components/StagingBanner';
import HelpAgent from './components/HelpAgent';
import DevGuard from './dev-guard';
import ClientBootstrap from './client-bootstrap';

function RootContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StickyNav />
      <main className="min-h-screen">
        {children}
      </main>
      <HelpAgent />
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="bg-paper text-[var(--ink)] antialiased">
        <div id="pdf-root" />
        <ClientBootstrap />
        {process.env.NODE_ENV !== 'production' && <DevGuard />}
        <AccessibilityProvider>
          <PlannerProvider>
            <RootContent>{children}</RootContent>
            <StagingBanner />
          </PlannerProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
