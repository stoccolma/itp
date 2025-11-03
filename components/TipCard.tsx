import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Tip } from '@/db/schema';

interface TipCardProps {
  tip: Tip;
}

export function TipCard({ tip }: TipCardProps) {
  // Dynamically get the icon component
  const IconComponent = (Icons[tip.icon as keyof typeof Icons] as LucideIcon) || Icons.Info;

  return (
    <Link
      href={`/tips/${tip.slug}`}
      className="group block p-6 rounded-lg border-2 border-[var(--editorial-text)]/10 hover:border-[var(--editorial-accent)] transition-colors bg-[var(--editorial-bg)]"
    >
      <article className="space-y-3">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--editorial-accent)]/10 flex items-center justify-center group-hover:bg-[var(--editorial-accent)]/20 transition-colors">
            <IconComponent className="w-6 h-6 text-[var(--editorial-accent)]" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-heading text-xl md:text-2xl tracking-tight text-[var(--editorial-text)] group-hover:text-[var(--editorial-accent)] transition-colors mb-2">
              {tip.title}
            </h3>
            
            <p className="font-body text-sm leading-relaxed text-[var(--editorial-text)]/70">
              {tip.excerpt}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="font-mono text-xs uppercase tracking-wider text-[var(--editorial-text)]/50">
            {tip.category.replace('-', ' ')}
          </span>
          <span className="font-mono text-xs text-[var(--editorial-accent)] group-hover:translate-x-1 transition-transform">
            Read →
          </span>
        </div>
      </article>
    </Link>
  );
}
