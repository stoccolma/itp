'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { MapPin } from 'lucide-react';
import type { Story } from '@/db/schema';

interface ChapterLayoutProps {
  story: Story;
  children?: React.ReactNode;
}

export function ChapterLayout({ story, children }: ChapterLayoutProps) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <header className="mb-12">
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-tight text-[var(--editorial-text)] mb-4">
          {story.title}
        </h1>
        
        {story.subtitle && (
          <p className="font-heading italic text-xl md:text-2xl text-[var(--editorial-text)]/60 mb-6">
            {story.subtitle}
          </p>
        )}
        
        {story.region && (
          <div className="pt-4 border-t border-[var(--editorial-text)]/10">
            <span className="flex items-center gap-2 font-mono text-sm text-[var(--editorial-text)]/60">
              <MapPin className="w-4 h-4" />
              {story.region}
            </span>
          </div>
        )}
      </header>

      {/* Body Content */}
      <div className="prose prose-lg max-w-none font-body text-[var(--editorial-text)]">
        <style jsx global>{`
          .prose h2 {
            font-family: 'Lora', Georgia, serif;
            font-size: 1.875rem;
            font-weight: 500;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            color: var(--editorial-text);
          }
          
          .prose h3 {
            font-family: 'Lora', Georgia, serif;
            font-size: 1.5rem;
            font-weight: 500;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: var(--editorial-text);
          }
          
          .prose p {
            line-height: 1.75;
            margin-bottom: 1.5rem;
            color: var(--editorial-text);
          }
          
          .prose blockquote {
            font-family: 'Lora', Georgia, serif;
            font-style: italic;
            font-size: 1.25rem;
            border-left: 4px solid var(--editorial-accent);
            padding-left: 1.5rem;
            margin: 2rem 0;
            color: var(--editorial-text);
          }
          
          .prose ul, .prose ol {
            margin: 1.5rem 0;
            padding-left: 1.5rem;
            color: var(--editorial-text);
          }
          
          .prose li {
            margin-bottom: 0.5rem;
          }
          
          .prose strong {
            font-weight: 600;
            color: var(--editorial-text);
          }
          
          .prose a {
            color: var(--editorial-accent);
            text-decoration: underline;
            transition: opacity 0.15s;
          }
          
          .prose a:hover {
            opacity: 0.7;
          }
        `}</style>
        
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
        >
          {story.bodyMd}
        </ReactMarkdown>
      </div>

      {/* Additional content slot */}
      {children}
    </article>
  );
}
