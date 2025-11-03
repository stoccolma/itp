export default function SicilyFooter() {
  return (
    <footer className="border-t border-zinc-200 border-[var(--line)] bg-white bg-[var(--paper)]">
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-12">
        <h2 className="text-xs tracking-wide uppercase text-zinc-500 text-[var(--ink)]/60 mb-3">
          About Sicily
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-zinc-700 text-[var(--ink)]">
          Every corner here was chosen by hand, not by algorithm—cafés where the owner still remembers your face, coves that smell of salt and fennel, bakeries that open when the dough says it's ready. We built this map out of affection, not data points.
        </p>
        <p className="text-sm md:text-base leading-relaxed text-zinc-700 text-[var(--ink)] mt-4">
          We don't collect emails or trace your path; the journey is yours alone.
        </p>
      </div>
    </footer>
  );
}
