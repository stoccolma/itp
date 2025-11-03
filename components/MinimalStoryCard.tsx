'use client';

import { useEffect, useState } from 'react';
import type { AreaFull } from '@/lib/areas';

interface MinimalStoryCardProps {
  area: AreaFull;
  featuredSrc?: string;
}

export default function MinimalStoryCard({ area, featuredSrc }: MinimalStoryCardProps) {
  const key = `itp_story_${area.slug}`;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved !== null) setOpen(saved === '1');
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, open ? '1' : '0');
  }, [key, open]);

  return (
    <section className="card overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--stone2)]/20 transition-colors"
      >
        {featuredSrc ? (
          <img
            src={featuredSrc}
            alt={`${area.name} thumbnail`}
            width={72}
            height={72}
            className="h-18 w-18 rounded-xl object-cover border border-[var(--stone2)]"
          />
        ) : (
          <div className="h-18 w-18 rounded-xl border border-[var(--stone2)] bg-[var(--sun)]/40" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--ink)]">{area.name}</h3>
          {area.short_desc && (
            <p className="text-sm opacity-80 line-clamp-2">{area.short_desc}</p>
          )}
        </div>
        <svg 
          className={`w-5 h-5 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        style={{
          maxHeight: open ? '500px' : '0',
          transition: 'max-height 0.4s ease'
        }}
        className="overflow-hidden"
      >
        {area.tucci_story && (
          <div className="px-4 pb-3">
            <p className="text-sm leading-relaxed opacity-90">{area.tucci_story}</p>
          </div>
        )}
      </div>
    </section>
  );
}
