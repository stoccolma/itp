import Link from 'next/link';

export function EditorialFooter() {
  return (
    <footer className="w-full">
      <div className="section-divider" />
      <div className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-heading text-lg text-[var(--editorial-text)] mb-1">
              ItaloPlanner
            </p>
            <p className="font-mono text-xs text-[var(--editorial-text)]/60">
              Where every stop has a story
            </p>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/"
              className="font-mono text-sm text-[var(--editorial-text)]/70 hover:text-[var(--editorial-accent)] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/magazine"
              className="font-mono text-sm text-[var(--editorial-text)]/70 hover:text-[var(--editorial-accent)] transition-colors"
            >
              Magazine
            </Link>
            <Link
              href="/tips"
              className="font-mono text-sm text-[var(--editorial-text)]/70 hover:text-[var(--editorial-accent)] transition-colors"
            >
              Tips
            </Link>
            <Link
              href="/about"
              className="font-mono text-sm text-[var(--editorial-text)]/70 hover:text-[var(--editorial-accent)] transition-colors"
            >
              About
            </Link>
          </nav>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[var(--editorial-text)]/10 text-center">
          <p className="font-mono text-xs text-[var(--editorial-text)]/50">
            This site may contain affiliate links. We only recommend places we genuinely love.{' '}
            <Link href="/about" className="underline hover:text-[var(--editorial-accent)] transition-colors">
              Learn more
            </Link>
          </p>
        </div>
      </div>
      </div>
    </footer>
  );
}
