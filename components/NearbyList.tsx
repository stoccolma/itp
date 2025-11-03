'use client';

import { useState } from 'react';
import { MapPin, Plus, Info } from 'lucide-react';
import { usePlanStore } from '@/stores/planStore';

interface NearbyItem {
  id: string;
  name: string;
  dist: number;
  category?: string;
  short_desc?: string;
}

interface NearbyListProps {
  items: NearbyItem[];
}

function POICard({ item }: { item: NearbyItem }) {
  const [expanded, setExpanded] = useState(false);
  const { addSidequest } = usePlanStore();
  
  // Calculate walk time
  const walkMinutes = Math.round((item.dist / 4) * 60); // 4 km/h walking speed
  const walkMeters = Math.round(item.dist * 1000);
  
  const handleAddSidequest = () => {
    addSidequest({
      id: `sidequest-${Date.now()}-${item.id}`,
      name: item.name,
      walkMinutes,
      walkMeters,
      type: item.category
    });
  };
  
  return (
    <div className="border-b border-zinc-200 border-[var(--line)] last:border-0 py-3">
      <div className="flex items-start gap-3">
        {/* Info expander button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-0.5 p-1 rounded hover:bg-zinc-100 transition-colors"
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <Info className={`w-4 h-4 text-zinc-400 text-[var(--ink)]0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        
        {/* POI info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-zinc-900 text-[var(--ink)] truncate">
            {item.name}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            {item.category && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-100 bg-[var(--card)] text-zinc-600 text-[var(--ink)]/60">
                {item.category}
              </span>
            )}
            <span className="text-xs text-zinc-500 text-[var(--ink)]/60 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {walkMinutes} min • {walkMeters}m
            </span>
          </div>
          
          {/* Expanded detail */}
          {expanded && item.short_desc && (
            <p className="text-xs text-zinc-600 text-[var(--ink)]/60 mt-2 leading-relaxed">
              {item.short_desc}
            </p>
          )}
        </div>
        
        {/* Add button */}
        <button
          onClick={handleAddSidequest}
          className="mt-0.5 p-1.5 rounded-full bg-zinc-900 bg-[var(--card)] text-zinc-50 hover:bg-zinc-700 transition-colors"
          aria-label="Add as sidequest"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {/* Add as Sidequest button when expanded */}
      {expanded && (
        <button
          onClick={handleAddSidequest}
          className="ml-10 mt-2 text-xs text-zinc-600 text-[var(--ink)]/60 hover:text-zinc-900 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add as Sidequest
        </button>
      )}
    </div>
  );
}

export default function NearbyList({ items }: NearbyListProps) {
  return (
    <div className="card p-4 space-y-2">
      <h3 className="text-lg font-bold text-zinc-900 text-[var(--ink)] mb-3">
        Nearby
      </h3>
      
      <div className="max-h-[500px] overflow-y-auto -mx-4 px-4">
        {items.map((item) => (
          <POICard key={item.id} item={item} />
        ))}
      </div>
      
      {items.length === 0 && (
        <p className="text-sm text-zinc-500 text-[var(--ink)]/60 text-center py-4">
          No nearby places found
        </p>
      )}
    </div>
  );
}
