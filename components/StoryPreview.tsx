import Link from 'next/link';
import Image from 'next/image';
import type { Story } from '@/db/schema';

interface StoryPreviewProps {
  story: Story;
}

export function StoryPreview({ story }: StoryPreviewProps) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group block overflow-hidden"
    >
      <article className="space-y-4">
        {story.coverImage && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={story.coverImage}
              alt={story.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="font-heading text-2xl md:text-3xl tracking-tight text-[var(--editorial-text)] group-hover:text-[var(--editorial-accent)] transition-colors">
            {story.title}
          </h3>
          
          {story.subtitle && (
            <p className="font-heading italic text-lg text-[var(--editorial-text)]/60">
              {story.subtitle}
            </p>
          )}
          
          <p className="font-body text-base leading-relaxed text-[var(--editorial-text)]/80">
            {story.excerpt}
          </p>
          
          {story.region && (
            <div className="pt-2">
              <span className="font-mono text-sm text-[var(--editorial-text)]/60">
                {story.region}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
