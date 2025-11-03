'use client';

import { ChevronUp, ChevronDown, Trash2, MapPin } from 'lucide-react';
import { usePlanStore } from '@/stores/planStore';

function formatWalkTime(walkMinutes?: number, walkMeters?: number): string {
  if (walkMinutes === undefined) return '';
  
  if (walkMinutes < 5) {
    return '2-3 min walk';
  } else if (walkMinutes > 25) {
    return 'Transit advised';
  }
  
  const distStr = walkMeters ? `${Math.round(walkMeters)}m` : '';
  return distStr ? `${distStr} • ${walkMinutes} min walk` : `${walkMinutes} min walk`;
}

export default function SidequestsList() {
  const { sidequests, removeSidequest, moveSidequest } = usePlanStore();
  
  if (sidequests.length === 0) {
    return (
      <div className="card p-4">
        <h3 className="text-lg font-bold text-zinc-900 text-[var(--ink)] mb-3">
          Sidequests
        </h3>
        <p className="text-sm text-zinc-500 text-[var(--ink)]/60 text-center py-4">
          Click the + button on nearby places to add sidequests
        </p>
      </div>
    );
  }
  
  return (
    <div className="card p-4">
      <h3 className="text-lg font-bold text-zinc-900 text-[var(--ink)] mb-3">
        Sidequests
      </h3>
      
      <div className="space-y-2">
        {sidequests.map((sidequest, index) => (
          <div
            key={sidequest.id}
            className="flex items-center gap-2 p-2 rounded bg-zinc-50 bg-[var(--card)]/50 border border-zinc-200 border-[var(--line)]"
          >
            {/* Reorder buttons */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => moveSidequest(sidequest.id, 'up')}
                disabled={index === 0}
                className="p-0.5 rounded hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Move up"
              >
                <ChevronUp className="w-3.5 h-3.5 text-zinc-600 text-[var(--ink)]/60" />
              </button>
              <button
                onClick={() => moveSidequest(sidequest.id, 'down')}
                disabled={index === sidequests.length - 1}
                className="p-0.5 rounded hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Move down"
              >
                <ChevronDown className="w-3.5 h-3.5 text-zinc-600 text-[var(--ink)]/60" />
              </button>
            </div>
            
            {/* Sidequest info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-zinc-900 text-[var(--ink)] truncate">
                {sidequest.name}
              </h4>
              {sidequest.walkMinutes !== undefined && (
                <div className="flex items-center gap-1 text-xs text-zinc-500 text-[var(--ink)]/60 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{formatWalkTime(sidequest.walkMinutes, sidequest.walkMeters)}</span>
                </div>
              )}
              {sidequest.type && (
                <span className="inline-block text-xs px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 text-orange-600 mt-1">
                  {sidequest.type}
                </span>
              )}
            </div>
            
            {/* Delete button */}
            <button
              onClick={() => removeSidequest(sidequest.id)}
              className="p-1.5 rounded hover:bg-red-100 text-red-600 transition-colors"
              aria-label="Remove sidequest"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
