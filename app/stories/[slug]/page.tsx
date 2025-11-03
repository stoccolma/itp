import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChapterLayout } from '@/components/ChapterLayout';
import { PageTransition } from '@/components/PageTransition';
import { EditorialFooter } from '@/components/EditorialFooter';
import { getStoryBySlug, getStories } from '@/lib/editorial';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  
  if (!story) {
    return {
      title: 'Story Not Found',
    };
  }

  return {
    title: `${story.title} | ItaloPlanner`,
    description: story.excerpt,
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  // Get all stories for "next story" teaser
  const allStories = await getStories();
  const currentIndex = allStories.findIndex((s) => s.slug === story.slug);
  const nextStory = currentIndex < allStories.length - 1 ? allStories[currentIndex + 1] : allStories[0];

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Story Content */}
        <ChapterLayout story={story} />

        {/* Next Story Teaser */}
        {nextStory && (
          <>
            <div className="section-divider" />
            <div className="container-editorial py-12">
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink)]/50 mb-4">
                Next Story
              </p>
              <Link
                href={`/stories/${nextStory.slug}`}
                className="group block"
              >
                <h3 className="font-heading text-2xl md:text-3xl tracking-tight group-hover:text-[var(--accent)] transition-colors mb-2">
                  {nextStory.title}
                </h3>
                <p className="font-body text-base text-[var(--ink)]/70">
                  {nextStory.excerpt}
                </p>
              </Link>
            </div>
          </>
        )}

        <EditorialFooter />
      </div>
    </PageTransition>
  );
}
