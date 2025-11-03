'use client';

import { useState, useEffect } from 'react';
import { PageTransition } from '@/components/PageTransition';
import { EditorialFooter } from '@/components/EditorialFooter';
import { PhraseSearch } from '@/components/PhraseSearch';
import { PhraseRow } from '@/components/PhraseRow';
import { getPhrases, searchPhrases, getAllCategories, categoryNames } from '@/lib/phrases';
import type { Phrase } from '@/db/schema';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

export default function PhrasebookPage() {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSicilian, setShowSicilian] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadPhrases() {
      const data = await getPhrases({ region: 'sicily' });
      setPhrases(data);
      // Expand all categories by default
      setExpandedCategories(new Set(getAllCategories(data)));
    }
    loadPhrases();
  }, []);

  const filteredPhrases = searchQuery
    ? searchPhrases(phrases, searchQuery)
    : phrases;

  const categories = getAllCategories(filteredPhrases);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <PageTransition>
      <div className="min-h-screen paper-surface">
        {/* Header */}
        <header className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <Link
            href="/tips"
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--editorial-accent)] hover:opacity-70 transition-opacity mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tips
          </Link>

          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl tracking-tight text-[var(--editorial-text)] mb-4">
            Phrasebook
          </h1>
          <p className="font-body text-lg md:text-xl text-[var(--editorial-text)]/70 max-w-2xl mb-8">
            Italian and Sicilian phrases with phonetics. Because knowing "picca picca" might save your dinner portions.
          </p>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <PhraseSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search phrases, categories, or phonetics..."
              />
            </div>
            <button
              onClick={() => setShowSicilian(!showSicilian)}
              className={`px-6 py-3 rounded-lg font-mono text-sm transition-all whitespace-nowrap ${
                showSicilian
                  ? 'bg-[var(--accent)] text-white'
                  : 'border border-[color-mix(in_oklab,var(--ink)_15%,transparent)] hover:bg-[color-mix(in_oklab,var(--ink)_5%,transparent)]'
              }`}
            >
              {showSicilian ? 'Show Sicilian ✓' : 'Hide Sicilian'}
            </button>
          </div>
        </header>

        {/* Phrases by category */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          {categories.length === 0 && (
            <div className="text-center py-16">
              <p className="font-mono text-sm text-[var(--editorial-text)]/60">
                No phrases found matching "{searchQuery}".
              </p>
            </div>
          )}

          {categories.map((category) => {
            const categoryPhrases = filteredPhrases.filter((p) => p.category === category);
            const isExpanded = expandedCategories.has(category);

            return (
              <div key={category} className="mb-8">
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between py-4 border-b-2 border-[var(--editorial-text)]/20 hover:border-[var(--editorial-accent)] transition-colors group"
                >
                  <h2 className="font-heading text-2xl md:text-3xl text-[var(--editorial-text)] group-hover:text-[var(--editorial-accent)] transition-colors">
                    {categoryNames[category] || category}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-[var(--editorial-text)]/60">
                      {categoryPhrases.length} {categoryPhrases.length === 1 ? 'phrase' : 'phrases'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[var(--editorial-text)]/60" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[var(--editorial-text)]/60" />
                    )}
                  </div>
                </button>

                {/* Category phrases */}
                {isExpanded && (
                  <div className="mt-4">
                    {categoryPhrases.map((phrase) => (
                      <PhraseRow
                        key={phrase.id}
                        phrase={phrase}
                        showSicilian={showSicilian}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <EditorialFooter />
      </div>
    </PageTransition>
  );
}
