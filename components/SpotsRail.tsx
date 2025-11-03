'use client';

import { MapPin } from 'lucide-react';

interface SpotsRailProps {
  items: Array<{
    id: string;
    name: string;
    dist: number;
  }>;
}

// Client-safe distance badge (same as DayPlanner)
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

export default function SpotsRail({ items }: SpotsRailProps) {
  
  if (items.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-bold text-[var(--ink)] mb-4">Nearby Spots</h3>
        <p className="text-sm opacity-70">No nearby places found.</p>
      </div>
    );
  }

  return (
    <div className="sticky top-20 space-y-4">
      <div className="card p-6">
        <h3 className="text-lg font-bold text-[var(--ink)] mb-1">Nearby Spots</h3>
        <p className="text-xs opacity-70 mb-4">Add to your day plan</p>
        
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          {items.map((item) => {
            
            return (
              <button
                key={item.id}
                className="w-full text-left card p-3 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[var(--stone)] focus:ring-offset-2"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(
                      new CustomEvent('itp:add-to-plan', { 
                        detail: item 
                      })
                    );
                  }
                }}
              >
                <h4 className="font-semibold text-sm text-[var(--ink)] leading-tight mb-1">
                  {item.name}
                </h4>
                <div className="flex items-center gap-1 text-xs opacity-60">
                  <MapPin className="w-3 h-3" />
                  <span>{distanceBadge(item.dist)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="card p-4 text-xs opacity-70">
        <p><strong>Tip:</strong> Click a spot to add it to your day plan.</p>
      </div>
    </div>
  );
}
