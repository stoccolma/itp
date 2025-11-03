'use client';

import { Search } from 'lucide-react';

interface PhraseSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PhraseSearch({ value, onChange, placeholder = 'Search phrases...' }: PhraseSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--editorial-text)]/40" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border border-[color-mix(in_oklab,var(--ink)_15%,transparent)] rounded-lg font-body text-base placeholder:text-[var(--ink)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
      />
    </div>
  );
}
