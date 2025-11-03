import { PageTransition } from '@/components/PageTransition';
import { EditorialFooter } from '@/components/EditorialFooter';
import Link from 'next/link';

export const metadata = {
  title: 'About | ItaloPlanner',
  description: 'Why we built this, and how we keep it honest',
};

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <article className="container-editorial py-12 md:py-16">
          <header className="mb-12">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              About ItaloPlanner
            </h1>
            <p className="font-heading italic text-xl md:text-2xl text-[var(--ink)]/60">
              Why we built this, and how we keep it honest
            </p>
          </header>

          <div className="space-y-8 font-body text-lg leading-relaxed">
            <section>
              <h2 className="font-heading text-2xl md:text-3xl mb-4">Why ItaloPlanner exists</h2>
              <p>
                Planning Sicily should not feel like homework. We keep it simple: real days, real places, and short stories that explain why they matter.
              </p>
              <p className="mt-4 text-sm text-[var(--ink)]/60 italic">
                Note: Currently limited to Sicily itineraries. Mainland coverage planned for future updates.
              </p>
            </section>

            <section className="border-t border-[var(--ink)]/10 pt-8">
              <h2 className="font-heading text-2xl md:text-3xl mb-4">How we stay honest</h2>
              <p>
                We use a few affiliate links for rooms, tables, and tours we would recommend to friends. If you book through them, we may earn a small commission at no extra cost. If something we list disappoints you, tell us. We will fix it or remove it.
              </p>
            </section>

            <section className="border-t border-[var(--ink)]/10 pt-8">
              <h2 className="font-heading text-2xl md:text-3xl mb-4">Contact</h2>
              <p className="mb-2">
                Found an error or want to share a place we missed?
              </p>
              <p className="font-mono text-sm">
                <a
                  href="mailto:hello@italoplanner.com"
                  className="text-[var(--accent)] underline hover:opacity-70 transition-opacity"
                >
                  hello@italoplanner.com
                </a>
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-[var(--ink)]/10">
            <p className="font-heading italic text-xl text-center text-[var(--ink)]/60">
              Built for people who still look up.
            </p>
          </div>
        </article>

        <EditorialFooter />
      </div>
    </PageTransition>
  );
}
