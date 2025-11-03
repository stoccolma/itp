import { PageTransition } from '@/components/PageTransition';
import { TipCard } from '@/components/TipCard';
import { EditorialFooter } from '@/components/EditorialFooter';
import { getTips } from '@/lib/editorial';
import Link from 'next/link';
import { Hand, Languages } from 'lucide-react';

export const metadata = {
  title: 'Tips | ItaloPlanner',
  description: 'Practical advice for navigating Sicily like you know what you\'re doing',
};

export default async function TipsPage() {
  const tips = await getTips();

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Header */}
        <header className="container-editorial py-12 md:py-16">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-tight mb-4">
            Tips
          </h1>
          <p className="font-body text-lg md:text-xl text-[var(--ink)]/70 max-w-2xl">
            Practical advice for navigating Sicily like you know what you're doing. Even if you don't.
          </p>
        </header>

        <div className="section-divider" />

        {/* Featured: Gestures & Phrasebook */}
        <section className="container-editorial py-12 md:py-16">
          <h2 className="font-heading text-2xl md:text-3xl mb-6">
            Local Survival
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gestures */}
            <Link
              href="/tips/gestures"
              className="group rounded-lg border border-[color-mix(in_oklab,var(--ink)_15%,transparent)] p-8 transition-all hover:border-[var(--accent)] hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent)]/10">
                <Hand className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h3 className="font-heading text-2xl mb-3 group-hover:text-[var(--accent)] transition-colors">
                Gestures Decoded
              </h3>
              <p className="font-body text-base text-[var(--ink)]/70 mb-4">
                Nine everyday gestures that say more than words. Learn what hands mean when mouths stay closed.
              </p>
              <span className="font-mono text-sm text-[var(--accent)]">
                View Gestures →
              </span>
            </Link>

            {/* Phrasebook */}
            <Link
              href="/tips/phrasebook"
              className="group rounded-lg border border-[color-mix(in_oklab,var(--ink)_15%,transparent)] p-8 transition-all hover:border-[var(--accent)] hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent)]/10">
                <Languages className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h3 className="font-heading text-2xl mb-3 group-hover:text-[var(--accent)] transition-colors">
                Phrasebook
              </h3>
              <p className="font-body text-base text-[var(--ink)]/70 mb-4">
                Italian and Sicilian with phonetics. Because knowing "picca picca" might save your dinner portions.
              </p>
              <span className="font-mono text-sm text-[var(--accent)]">
                Browse Phrases →
              </span>
            </Link>
          </div>
        </section>

        <div className="section-divider" />

        {/* General Tips Grid */}
        <section className="container-editorial py-12 md:py-16">
          <h2 className="font-heading text-2xl md:text-3xl mb-6">
            Practical Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>

          {tips.length === 0 && (
            <div className="text-center py-16">
              <p className="font-mono text-sm text-[var(--ink)]/60">
                No tips yet. Check back soon.
              </p>
            </div>
          )}
        </section>

        <EditorialFooter />
      </div>
    </PageTransition>
  );
}
