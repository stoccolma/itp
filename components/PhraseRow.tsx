'use client';

import { Phrase } from '@/db/schema';
import { Volume2 } from 'lucide-react';

interface PhraseRowProps {
  phrase: Phrase;
  showSicilian?: boolean;
}

export function PhraseRow({ phrase, showSicilian = true }: PhraseRowProps) {
  return (
    <div className="py-4 border-b border-[color-mix(in_oklab,var(--ink)_10%,transparent)] last:border-0 hover:bg-[color-mix(in_oklab,var(--ink)_3%,transparent)] transition-colors">
      <div className="grid gap-3">
        {/* English */}
        <div>
          <p className="font-body text-base text-[var(--editorial-text)] font-medium mb-1">
            {phrase.english}
          </p>
        </div>

        {/* Italian */}
        <div className="grid sm:grid-cols-2 gap-2">
          <div>
            <p className="font-heading text-lg text-[var(--editorial-text)]">
              {phrase.italian}
            </p>
            <p className="font-mono text-xs text-[var(--editorial-text)]/60 mt-0.5">
              {phrase.italianPhonetic}
            </p>
          </div>

          {/* Sicilian */}
          {showSicilian && phrase.sicilian && (
            <div>
              <p className="font-heading text-lg text-[var(--editorial-accent)]">
                {phrase.sicilian}
              </p>
              <p className="font-mono text-xs text-[var(--editorial-text)]/60 mt-0.5">
                {phrase.sicilianPhonetic}
              </p>
            </div>
          )}
        </div>

        {/* Notes */}
        {phrase.notes && (
          <p className="font-body text-sm italic text-[var(--editorial-text)]/70">
            {phrase.notes}
          </p>
        )}
      </div>
    </div>
  );
}
