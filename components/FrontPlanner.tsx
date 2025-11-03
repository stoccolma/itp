'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import type { AreaFull } from '@/lib/areas';

// Featured six destinations
const FEATURED_DESTINATIONS = [
  { slug: 'palermo', name: 'Palermo' },
  { slug: 'catania', name: 'Catania' },
  { slug: 'taormina', name: 'Taormina' },
  { slug: 'siracusa', name: 'Siracusa' },
  { slug: 'noto', name: 'Noto' },
  { slug: 'agrigento', name: 'Agrigento' }
];

type FrontPlannerProps = {
  areas: AreaFull[];
  initialFrom?: string;
  initialDate?: string;
};

export default function FrontPlanner({ areas, initialFrom, initialDate }: FrontPlannerProps) {
  const router = useRouter();
  const plannerRef = useRef<HTMLDivElement | null>(null);
  const [from, setFrom] = useState(initialFrom ?? 'palermo');
  const [date, setDate] = useState(initialDate ?? '');
  const [announcement, setAnnouncement] = useState('');

  // Sync state when URL parameters change (e.g., from map clicks)
  useEffect(() => {
    if (initialFrom !== undefined) {
      setFrom(initialFrom);
    }
    if (initialDate !== undefined) {
      setDate(initialDate);
    }
  }, [initialFrom, initialDate]);

  // Update URL when from/date changes
  useEffect(() => {
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (date) qs.set('date', date);
    const queryString = qs.toString();
    router.replace(queryString ? `/?${queryString}` : '/', { scroll: false });
  }, [from, date, router]);

  // Auto-start logic
  const canStart = from && date && areas.length > 0;

  useEffect(() => {
    if (!canStart) return;
    
    const area = areas.find(a => a.slug === from);
    if (area) {
      setAnnouncement(`Planning for ${area.name}, ${date}`);
    }
  }, [canStart, from, date, areas]);

  // Auto-scroll to map when city+date are selected
  useEffect(() => {
    if (!canStart) return;
    
    // Scroll to map section
    const mapSection = document.querySelector('[data-map-section]');
    if (mapSection) {
      window.requestAnimationFrame(() => {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
    
    // Trigger map zoom via custom event
    const selectedArea = areas.find(a => a.slug === from);
    if (selectedArea && selectedArea.lat && selectedArea.lon) {
      window.dispatchEvent(new CustomEvent('zoomToArea', {
        detail: {
          lon: selectedArea.lon,
          lat: selectedArea.lat
        }
      }));
    }
  }, [canStart, from, areas]);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const selectedArea = areas.find(a => a.slug === from);

  const handleReset = () => {
    setFrom('');
    setDate('');
  };

  return (
    <div className="bg-zinc-100 bg-[var(--paper)]">
      {/* Screen reader announcement */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Selection Form */}
      <div className="max-w-xl mx-auto px-4 pt-6 pb-4">
        <div className="card p-6 md:p-8 space-y-6 bg-white bg-[var(--card)]">
          {/* Headline */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3 text-zinc-900 text-[var(--ink)]">
              Discover Sicily, where every stop has a story.
            </h1>
            <p className="text-sm md:text-base leading-tight max-w-prose mx-auto text-zinc-700">
              Sun on stone, salt on your lips, and a day that actually flows.
            </p>
          </div>
          
          {/* City Dropdown */}
          <div>
            <label htmlFor="areaSelect" className="block text-sm font-semibold text-zinc-900 text-[var(--ink)] mb-2">
              Select City
            </label>
            <select
              id="areaSelect"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-4 py-3 border-2 border-zinc-300 border-[var(--line)] rounded-lg focus:border-zinc-500 focus:outline-none text-zinc-900 text-[var(--ink)] bg-white"
            >
              {FEATURED_DESTINATIONS.map((dest) => (
                <option 
                  key={dest.slug} 
                  value={dest.slug}
                >
                  {dest.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label htmlFor="datePicker" className="block text-sm font-semibold text-zinc-900 text-[var(--ink)] mb-2">
              Select Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="datePicker"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="w-full px-4 py-3 border-2 border-zinc-300 border-[var(--line)] rounded-lg focus:border-zinc-500 focus:outline-none text-zinc-900 text-[var(--ink)] bg-white"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 text-[var(--ink)]/60 pointer-events-none" />
            </div>
          </div>

          {/* Reset Button */}
          {canStart && (
            <button
              onClick={handleReset}
              className="w-full px-4 py-3 border-2 border-zinc-300 border-[var(--line)] rounded-lg hover:border-zinc-500 hover:bg-zinc-100 transition-colors text-zinc-900 text-[var(--ink)] font-medium"
            >
              Reset Selection
            </button>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-4 max-w-lg mx-auto">
          <div className="card p-6 text-center bg-white bg-[var(--card)]">
            <h3 className="font-semibold text-zinc-700 mb-2">Privacy First</h3>
            <p className="text-sm text-zinc-600 text-[var(--ink)]/60">No tracking, no data selling. Your plans are yours alone.</p>
          </div>
          <div className="card p-6 text-center bg-white bg-[var(--card)]">
            <h3 className="font-semibold text-zinc-700 mb-2">Support Local</h3>
            <p className="text-sm text-zinc-600 text-[var(--ink)]/60">Every recommendation supports real people, not chains.</p>
          </div>
        </div>

        {/* Scroll anchor for planner */}
        {canStart && (
          <div 
            ref={plannerRef}
            aria-live="polite" 
            className="sr-only"
          >
            Planning for {selectedArea?.name}, {date}
          </div>
        )}
      </div>

    </div>
  );
}
