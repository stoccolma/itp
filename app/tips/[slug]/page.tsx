import { notFound } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PageTransition } from '@/components/PageTransition';
import { EditorialFooter } from '@/components/EditorialFooter';
import { getTipBySlug, getTips } from '@/lib/editorial';
import { ArrowLeft } from 'lucide-react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export async function generateStaticParams() {
  const tips = await getTips();
  return tips.map((tip) => ({
    slug: tip.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tip = await getTipBySlug(slug);
  
  if (!tip) {
    return {
      title: 'Tip Not Found',
    };
  }

  return {
    title: `${tip.title} | ItaloPlanner Tips`,
    description: tip.excerpt,
  };
}

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tip = await getTipBySlug(slug);

  if (!tip) {
    notFound();
  }

  const IconComponent = (Icons[tip.icon as keyof typeof Icons] as LucideIcon) || Icons.Info;

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Tip Content */}
        <article className="container-editorial py-12 md:py-16">
          <header className="mb-12">
            <div className="flex items-start gap-6 mb-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-[var(--accent)]" />
              </div>
              
              <div className="flex-1">
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--ink)]/50 mb-2">
                  {tip.category.replace('-', ' ')}
                </p>
                <h1 className="font-heading text-4xl md:text-5xl tracking-tight">
                  {tip.title}
                </h1>
              </div>
            </div>
            
            <p className="font-body text-lg text-[var(--ink)]/70">
              {tip.excerpt}
            </p>
          </header>

          <div className="prose prose-lg max-w-none font-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {tip.bodyMd}
            </ReactMarkdown>
          </div>
        </article>

        <EditorialFooter />
      </div>
    </PageTransition>
  );
}
