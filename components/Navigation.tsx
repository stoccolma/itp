'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Eye, Type, Moon } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function Navigation() {
  const { settings, toggleDyslexiaFont, toggleDarkMode, toggleTextOnly } =
    useAccessibility();

  return (
    <nav className="bg-espresso-900 text-terracotta-50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Centered Logo */}
        <div className="flex justify-center mb-2">
          <Link href="/">
            <img src="/itpwhite.svg" alt="ItaloPlanner" className="h-16 md:h-20" />
          </Link>
        </div>

        {/* Centered Accessibility Menu */}
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={toggleDyslexiaFont}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9966] ${
              settings.dyslexiaFont ? 'bg-[#43b3ae] text-white' : 'hover:bg-[#43b3ae] hover:bg-opacity-20'
            }`}
            aria-label="Toggle dyslexia font"
          >
            <Type className="w-4 h-4" />
            <span className="text-sm">Dyslexia Font</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9966] ${
              settings.darkMode ? 'bg-[#43b3ae] text-white' : 'hover:bg-[#43b3ae] hover:bg-opacity-20'
            }`}
            aria-label="Toggle dark mode"
          >
            <Moon className="w-4 h-4" />
            <span className="text-sm">Dark Mode</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
