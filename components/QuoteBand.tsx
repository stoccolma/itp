interface QuoteBandProps {
  quote: string;
  attribution?: string;
}

export function QuoteBand({ quote, attribution }: QuoteBandProps) {
  return (
    <section className="w-full py-16 md:py-24 bg-[var(--editorial-accent)]/10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <blockquote className="font-heading italic text-2xl md:text-3xl lg:text-4xl tracking-tight text-[var(--editorial-text)]">
          "{quote}"
        </blockquote>
        {attribution && (
          <p className="font-mono text-sm mt-4 text-[var(--editorial-text)]/60">
            — {attribution}
          </p>
        )}
      </div>
    </section>
  );
}
