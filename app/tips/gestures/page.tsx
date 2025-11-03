'use client';

import { useState, useEffect } from 'react';
import { PageTransition } from '@/components/PageTransition';
import { EditorialFooter } from '@/components/EditorialFooter';
import { GestureCard } from '@/components/GestureCard';
import { GestureModal } from '@/components/GestureModal';
import { getGestures, getAllTags } from '@/lib/gestures';
import type { Gesture } from '@/db/schema';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GesturesPage() {
  const [gestures, setGestures] = useState<Gesture[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedGesture, setSelectedGesture] = useState<Gesture | null>(null);

  useEffect(() => {
    async function loadGestures() {
      const data = await getGestures({ region: 'sicily' });
      setGestures(data);
      setAllTags(getAllTags(data));
    }
    loadGestures();
  }, []);

  const filteredGestures = selectedTag
    ? gestures.filter((g) => {
        const tags = JSON.parse(g.tags);
        return tags.includes(selectedTag);
      })
    : gestures;

  return (
    <PageTransition>
      <div className="min-h-screen paper-surface">
        {/* Header */}
        <header className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <Link
            href="/tips"
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--editorial-accent)] hover:opacity-70 transition-opacity mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tips
          </Link>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-tight text-[var(--editorial-text)] mb-4">
            Gestures Decoded
          </h1>
          <p className="font-body text-lg md:text-xl text-[var(--editorial-text)]/70 max-w-2xl">
            Nine everyday gestures that say more than words. Learn what hands mean when mouths stay closed.
          </p>
        </header>

        {/* Tag filters */}
        <section className="max-w-6xl mx-auto px-6 mb-12">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full font-mono text-sm transition-all ${
                selectedTag === null
                  ? 'bg-[var(--accent)] text-white'
                  : 'border border-[color-mix(in_oklab,var(--ink)_15%,transparent)] hover:bg-[color-mix(in_oklab,var(--ink)_5%,transparent)]'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full font-mono text-sm transition-all capitalize ${
                  selectedTag === tag
                    ? 'bg-[var(--accent)] text-white'
                    : 'border border-[color-mix(in_oklab,var(--ink)_15%,transparent)] hover:bg-[color-mix(in_oklab,var(--ink)_5%,transparent)]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Gestures grid */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGestures.map((gesture) => (
              <GestureCard
                key={gesture.id}
                gesture={gesture}
                onClick={() => setSelectedGesture(gesture)}
              />
            ))}
          </div>

          {filteredGestures.length === 0 && (
            <div className="text-center py-16">
              <p className="font-mono text-sm text-[var(--editorial-text)]/60">
                No gestures found for this filter.
              </p>
            </div>
          )}
        </section>

        {/* Modal */}
        {selectedGesture && (
          <GestureModal
            gesture={selectedGesture}
            onClose={() => setSelectedGesture(null)}
          />
        )}

        <EditorialFooter />
      </div>
    </PageTransition>
  );
}
