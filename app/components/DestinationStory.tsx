'use client';

interface DestinationStoryProps {
  areaName: string;
  citySlug: string;
  introText?: string;
}

export default function DestinationStory({ areaName, citySlug, introText }: DestinationStoryProps) {
  return (
    <div className="mt-8">
      <div className="card p-6 bg-white bg-[var(--card)] max-w-3xl mx-auto">
        <h3 className="text-lg font-semibold text-zinc-900 text-[var(--ink)] mb-3">
          {areaName}
        </h3>
        <p className="text-sm text-zinc-700 leading-relaxed">
          {introText || `${areaName} awaits your discovery. Every corner has a story to tell.`}
        </p>
      </div>
    </div>
  );
}
