'use client';

import { Gesture } from '@/db/schema';
import { parseTags } from '@/lib/gestures';
import { Hand } from 'lucide-react';

interface GestureCardProps {
  gesture: Gesture;
  onClick: () => void;
}

export function GestureCard({ gesture, onClick }: GestureCardProps) {
  const tags = parseTags(gesture.tags);

  return (
    <button
      onClick={onClick}
      className="group relative rounded-lg border border-[color-mix(in_oklab,var(--ink)_15%,transparent)] p-6 text-left transition-all hover:border-[var(--accent)] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
    >
      {/* Icon/Image placeholder */}
      <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[var(--editorial-accent)]/10">
        <Hand className="w-8 h-8 text-[var(--editorial-accent)]" />
      </div>

      {/* Title */}
      <h3 className="font-heading text-xl mb-2 text-[var(--editorial-text)] group-hover:text-[var(--editorial-accent)] transition-colors">
        {gesture.title}
      </h3>

      {/* Meaning */}
      <p className="font-body text-sm text-[var(--editorial-text)]/70 mb-4">
        {gesture.meaningShort}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs px-2 py-1 rounded border border-[color-mix(in_oklab,var(--ink)_10%,transparent)] text-[var(--ink)]/60"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
