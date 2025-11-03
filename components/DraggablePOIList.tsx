'use client';

import { MapPin, GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface POIItem {
  id: string;
  name: string;
  dist: number;
  category?: string;
}

interface DraggablePOIListProps {
  items: POIItem[];
}

// Client-safe distance badge
function distanceBadge(km: number): string {
  const kmr = Math.max(0.1, Math.round(km * 10) / 10);
  const WALK_KMH = 4;
  const DRIVE_KMH = 35;
  const walkMin = Math.round((kmr / WALK_KMH) * 60);
  
  if (kmr <= 1.2) {
    const buckets = [2, 3, 4, 5, 7, 10, 12, 15];
    const best = buckets.reduce((p, c) => 
      Math.abs(c - walkMin) < Math.abs(p - walkMin) ? c : p, buckets[0]
    );
    return `${kmr.toFixed(1)} km • ${best} min walk`;
  }
  
  const driveMin = Math.round((kmr / DRIVE_KMH) * 60);
  const bucket = driveMin <= 5 ? "≈5" : 
                 driveMin <= 8 ? "5–8" : 
                 driveMin <= 12 ? "8–12" : 
                 driveMin <= 20 ? "12–20" : "20+";
  return `${kmr.toFixed(1)} km • ${bucket} min drive`;
}

function DraggablePOI({ item }: { item: POIItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `poi-${item.id}`,
    data: {
      id: item.id,
      name: item.name,
      dist: item.dist,
      category: item.category,
      // Include all available fields for proper POI creation
      lat: 0,
      lon: 0,
      categories: [],
      tags: []
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
    scale: isDragging ? '0.95' : '1',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`card p-3 bg-white bg-[var(--card)] transition-all duration-200 ${
        isDragging ? 'shadow-2xl ring-2 ring-zinc-500' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          {...listeners}
          {...attributes}
          className="mt-1 p-1 rounded hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          aria-label={`Drag ${item.name}`}
        >
          <GripVertical className="w-4 h-4 text-zinc-400 text-[var(--ink)]0" />
        </button>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-zinc-900 text-[var(--ink)] leading-tight mb-1 break-words line-clamp-2">
            {item.name}
          </h4>
          <div className="flex items-center gap-1 text-xs text-zinc-500 text-[var(--ink)]/60">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{distanceBadge(item.dist)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DraggablePOIList({ items }: DraggablePOIListProps) {
  if (items.length === 0) {
    return (
      <div className="card p-6 bg-white bg-[var(--card)]">
        <h3 className="text-lg font-bold text-zinc-900 text-[var(--ink)] mb-4">Nearby Places</h3>
        <p className="text-sm text-zinc-600 text-[var(--ink)]/60">No nearby places found.</p>
      </div>
    );
  }

  return (
    <div className="card p-6 bg-white bg-[var(--card)]">
        <h3 className="text-lg font-bold text-zinc-900 text-[var(--ink)] mb-1">Nearby Places</h3>
        <p className="text-xs text-zinc-600 text-[var(--ink)]/60 mb-4">
          Drag to add to your day plan
        </p>
        
        <div className="space-y-3">
          {items.map((item) => (
            <DraggablePOI key={item.id} item={item} />
          ))}
        </div>
      
      <div className="mt-4 p-4 text-xs text-zinc-600 text-[var(--ink)]/60 bg-zinc-100 bg-[var(--paper)]/50 rounded-lg space-y-2">
        <p><strong>Mouse:</strong> Click and drag the grip icon to move places into time slots.</p>
        <p><strong>Keyboard:</strong> Tab to a place, press Space to pick up, use arrow keys to navigate to a slot, press Space to drop.</p>
        <p><strong>Autoscroll:</strong> Drag near the top or bottom of either column to auto-scroll.</p>
      </div>
    </div>
  );
}
