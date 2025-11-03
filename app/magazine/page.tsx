import { PageTransition } from '@/components/PageTransition';
import { StoryPreview } from '@/components/StoryPreview';
import { EditorialFooter } from '@/components/EditorialFooter';
import { getStories, parseTags } from '@/lib/editorial';
import Link from 'next/link';

export const metadata = {
  title: 'Magazine | ItaloPlanner',
  description: 'Stories from Sicily that go deeper than the guidebook',
};

export default async function MagazinePage() {
  const stories = await getStories();

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Header */}
        <header className="container-editorial py-12 md:py-16">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-tight mb-4">
            Magazine
          </h1>
          <p className="font-body text-lg md:text-xl text-[var(--ink)]/70 max-w-2xl">
            Stories from Sicily that go deeper than the guidebook. Each one a reason to visit, stay longer, or come back.
          </p>
        </header>

        <div className="section-divider" />

        {/* Story Grid */}
        <section className="container-editorial py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
            {stories.map((story) => (
              <StoryPreview key={story.id} story={story} />
            ))}
          </div>

          {stories.length === 0 && (
            <div className="text-center py-16">
              <p className="font-mono text-sm text-[var(--ink)]/60">
                No stories yet. Check back soon.
              </p>
            </div>
          )}
        </section>

        <EditorialFooter />
      </div>
    </PageTransition>
  );
}
