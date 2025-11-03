'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export function StickyNav() {
  const { settings, toggleDyslexiaFont, toggleDarkMode, toggleTextOnly } = useAccessibility();

  return (
    <>
      <header className="sticky top-0 z-40 transition-colors duration-150">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Brand + Tagline */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/logo-itp-drop.png" 
            alt="ITP" 
            width={24} 
            height={30}
            className="opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="flex flex-col">
            <span className="font-serif text-base font-medium text-[var(--editorial-text)] tracking-tight">
              ItaloPlanner
            </span>
            <span className="font-serif text-[13px] text-[var(--editorial-text)]/70 tracking-wide hidden sm:block">
              Where every stop has a story
            </span>
          </div>
        </Link>

        {/* Center: Nav Links */}
        <nav className="flex items-center gap-1 text-sm font-serif">
          <Link href="/#planner" className="nav-link px-3 py-1">
            Planner
          </Link>
          <span className="text-[var(--editorial-text)]/30">•</span>
          <Link href="/magazine" className="nav-link px-3 py-1">
            Magazine
          </Link>
          <span className="text-[var(--editorial-text)]/30">•</span>
          <Link href="/tips" className="nav-link px-3 py-1">
            Tips
          </Link>
          <span className="text-[var(--editorial-text)]/30">•</span>
          <Link href="/about" className="nav-link px-3 py-1">
            About
          </Link>
        </nav>

        {/* Right: Accessibility Toggles */}
        <div className="flex items-center gap-4 text-sm font-serif">
          <button
            onClick={toggleDyslexiaFont}
            className="nav-link hidden lg:block"
            aria-pressed={settings.dyslexiaFont}
            aria-label="Toggle dyslexia-friendly font"
          >
            Dyslexia Font
          </button>
          <button
            onClick={toggleDarkMode}
            className="nav-link"
            aria-pressed={settings.darkMode}
            aria-label="Toggle dark mode"
          >
            Dark Mode
          </button>
          <button
            onClick={toggleTextOnly}
            className="nav-link hidden lg:block"
            aria-pressed={settings.textOnly}
            aria-label="Toggle text-only mode"
          >
            Text-Only
          </button>
        </div>
        </div>
      </header>
      <div className="section-divider" />
    </>
  );
}
