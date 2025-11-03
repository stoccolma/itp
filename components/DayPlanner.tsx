'use client';

import { useState, useEffect, useRef } from 'react';
import type { PlanSlot } from '@/lib/plan';
import type { POI } from '@/lib/pois';
import { Clock, MapPin, Download, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { generateItineraryPDF } from '@/lib/pdf';
import { usePlanStore } from '@/stores/planStore';

// City centers for start point
const CITY_CENTERS: Record<string, { lat: number; lon: number }> = {
  palermo: { lat: 38.1157, lon: 13.3614 },
  catania: { lat: 37.5079, lon: 15.0870 },
  taormina: { lat: 37.8517, lon: 15.2869 },
  siracusa: { lat: 37.0755, lon: 15.2866 },
  noto: { lat: 36.8907, lon: 15.0698 },
  agrigento: { lat: 37.3110, lon: 13.5765 }
};

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

// Only use real tucci_short from CSV
function tucciShort(poi: POI): string {
  return (poi as any).tucci_short || '';
}

interface DayPlannerProps {
  initialSlots: PlanSlot[];
  dateISO: string;
  areaName: string;
  onSlotsChange?: (slots: PlanSlot[]) => void;
  sidequests?: import('@/lib/plan').Sidequest[];
}


function DroppableSlot({ 
  slot, 
  index,
  onTimeChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  isFirst,
  isLast,
  hasStartPoint
}: { 
  slot: PlanSlot; 
  index: number;
  onTimeChange: (index: number, newTime: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
  hasStartPoint: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: slot.id,
    data: { slotIndex: index }
  });
  
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editTime, setEditTime] = useState(slot.time);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const handleTimeClick = () => {
    if (slot.poi) {
      setIsEditingTime(true);
      setTimeout(() => timeInputRef.current?.focus(), 0);
    }
  };

  const handleTimeBlur = () => {
    setIsEditingTime(false);
    if (editTime && editTime !== slot.time) {
      onTimeChange(index, editTime);
    }
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTimeBlur();
    } else if (e.key === 'Escape') {
      setEditTime(slot.time);
      setIsEditingTime(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border-l-4 transition-all min-h-[60px] ${
        isOver 
          ? 'border-zinc-600 border-[var(--line)] bg-zinc-50 bg-[var(--card)] shadow-lg ring-2 ring-zinc-400' 
          : 'border-zinc-400 border-[var(--line)] bg-white bg-[var(--card)] hover:shadow-sm'
      }`}
    >
      {/* Time */}
      <div className="flex items-center gap-1.5 w-[72px] shrink-0">
        <Clock className="w-3.5 h-3.5 text-zinc-400 text-[var(--ink)]0" />
        {isEditingTime ? (
          <input
            ref={timeInputRef}
            type="time"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
            onBlur={handleTimeBlur}
            onKeyDown={handleTimeKeyDown}
            className="text-sm font-mono font-semibold text-zinc-900 text-[var(--ink)] bg-transparent border-b border-zinc-400 focus:outline-none w-16"
          />
        ) : (
          <span 
            onClick={handleTimeClick}
            className={`text-sm font-mono font-semibold text-zinc-900 text-[var(--ink)] ${slot.poi ? 'cursor-pointer hover:text-zinc-600' : ''}`}
          >
            {slot.time}
          </span>
        )}
      </div>

      {slot.poi ? (
        <>
          {/* Name */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-zinc-900 text-[var(--ink)] truncate">
              {slot.poi.name}
            </h3>
          </div>

          {/* Distance/Walk - hide on first stop if no start point */}
          {(index > 0 || hasStartPoint) && slot.distance !== undefined && slot.distance > 0 && (
            <div className="flex items-center gap-1 text-xs text-zinc-500 text-[var(--ink)]/60 shrink-0">
              <MapPin className="w-3 h-3" />
              <span className="whitespace-nowrap">{distanceBadge(slot.distance)}</span>
            </div>
          )}

          {/* Tag */}
          <span className="text-xs px-2 py-1 rounded bg-zinc-200 bg-[var(--card)] text-zinc-700 shrink-0">
            {slot.title}
          </span>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onMoveUp(index)}
              disabled={isFirst}
              className="p-1 hover:bg-zinc-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Move up"
            >
              <ChevronUp className="w-4 h-4 text-zinc-600 text-[var(--ink)]/60" />
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={isLast}
              className="p-1 hover:bg-zinc-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Move down"
            >
              <ChevronDown className="w-4 h-4 text-zinc-600 text-[var(--ink)]/60" />
            </button>
            <button
              onClick={() => onRemove(index)}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
              aria-label="Remove"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 text-center text-sm text-zinc-500 text-[var(--ink)]/60">
          {isOver ? (
            <span className="font-medium text-zinc-700">Drop here</span>
          ) : (
            <span>Drag a place here</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function DayPlanner({ initialSlots, dateISO, areaName, onSlotsChange, sidequests = [] }: DayPlannerProps) {
  const [slots, setSlots] = useState<PlanSlot[]>(initialSlots);
  const plannerRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const { startAnchor, setStartAnchor } = usePlanStore();
  
  const hasStartPoint = startAnchor.type !== null;

  // Notify parent when slots change
  useEffect(() => {
    if (onSlotsChange) {
      onSlotsChange(slots);
    }
  }, [slots, onSlotsChange]);

  const handleTimeChange = (index: number, newTime: string) => {
    setSlots(prev => {
      const newSlots = [...prev];
      newSlots[index] = { ...newSlots[index], time: newTime };
      return newSlots;
    });
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setSlots(prev => {
      const newSlots = [...prev];
      [newSlots[index - 1], newSlots[index]] = [newSlots[index], newSlots[index - 1]];
      return newSlots;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === slots.length - 1) return;
    setSlots(prev => {
      const newSlots = [...prev];
      [newSlots[index], newSlots[index + 1]] = [newSlots[index + 1], newSlots[index]];
      return newSlots;
    });
  };

  const handleRemove = (index: number) => {
    setSlots(prev => {
      const newSlots = [...prev];
      newSlots[index] = { ...newSlots[index], poi: undefined, distance: undefined };
      return newSlots;
    });
  };

  const handleDownloadPDF = () => {
    // Check if there are any filled slots
    const filledSlots = slots.filter(s => s.poi);
    if (filledSlots.length === 0) {
      alert('Please add at least one place to your itinerary before downloading.');
      return;
    }
    
    // Open print page in new tab with query params
    const printUrl = `/print?from=${encodeURIComponent(areaName)}&date=${encodeURIComponent(dateISO)}`;
    window.open(printUrl, '_blank');
  };

  // Listen for add-to-plan events from SpotsRail
  useEffect(() => {
    const handleAddToPlan = (event: CustomEvent) => {
      const poi = event.detail as POI & { dist: number };
      
      // Find first empty slot
      setSlots(prevSlots => {
        const emptyIndex = prevSlots.findIndex(s => !s.poi);
        if (emptyIndex === -1) return prevSlots;
        
        const newSlots = [...prevSlots];
        newSlots[emptyIndex] = {
          ...newSlots[emptyIndex],
          poi: poi,
          distance: poi.dist,
        };
        return newSlots;
      });
    };

    window.addEventListener('itp:add-to-plan', handleAddToPlan as EventListener);
    return () => {
      window.removeEventListener('itp:add-to-plan', handleAddToPlan as EventListener);
    };
  }, []);

  // Format date for display
  const dateObj = new Date(dateISO + 'T12:00:00');
  const dateFormatted = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="w-full max-w-[620px] mx-auto">
      <div className="card p-6 space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 text-[var(--ink)]">Day Planner</h2>
          <p className="text-sm text-zinc-600 text-[var(--ink)]/60">{dateFormatted}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={handleDownloadPDF}
            data-testid="download-pdf"
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 bg-[var(--card)] text-zinc-50 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </button>
          <p className="text-xs text-zinc-500 text-[var(--ink)]/60">
            Download is local to your device. We store none of it.
          </p>
        </div>
      </div>

      <div ref={plannerRef}>

      {/* Start Point Control */}
      <div className="mb-4 p-3 bg-zinc-50 bg-[var(--card)]/50 rounded-lg border border-zinc-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600 text-[var(--ink)]/60">Start from:</span>
          {!hasStartPoint ? (
            <div className="relative">
              <button
                onClick={() => setShowStartMenu(!showStartMenu)}
                className="text-sm px-3 py-1.5 rounded-full border border-zinc-300 border-[var(--line)] bg-white bg-[var(--card)] hover:bg-zinc-50 transition-colors"
              >
                Set starting point
              </button>
              {showStartMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white bg-[var(--card)] border border-zinc-300 border-[var(--line)] rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      const cityKey = areaName.toLowerCase();
                      const center = CITY_CENTERS[cityKey];
                      if (center) {
                        setStartAnchor({
                          type: 'city_center',
                          ...center,
                          name: `${areaName} Center`
                        });
                        console.log('📍 Start anchor set to city center:', center);
                      }
                      setShowStartMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 rounded-t-lg"
                  >
                    City center
                  </button>
                  <button
                    onClick={() => {
                      const address = prompt('Enter address or location in ' + areaName + ':');
                      if (address && address.trim()) {
                        const cityKey = areaName.toLowerCase();
                        const center = CITY_CENTERS[cityKey];
                        if (center) {
                          setStartAnchor({
                            type: 'custom_address',
                            ...center,
                            name: address.trim()
                          });
                          console.log('📍 Start anchor set to custom address:', address.trim(), 'using', cityKey, 'center as coordinates');
                        }
                      }
                      setShowStartMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100"
                  >
                    Enter address
                  </button>
                  <button
                    onClick={() => {
                      alert('Click on map to set starting point (coming soon)');
                      setShowStartMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-zinc-100 rounded-b-lg"
                  >
                    Pick on map
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-900 text-[var(--ink)]">
                {startAnchor.name || 'Custom location'}
              </span>
              <button
                onClick={() => {
                  setStartAnchor({ type: null });
                  console.log('📍 Start anchor cleared');
                }}
                className="text-xs text-red-600 hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {slots.map((slot, i) => (
          <DroppableSlot
            key={slot.id}
            slot={slot}
            index={i}
            onTimeChange={handleTimeChange}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onRemove={handleRemove}
            isFirst={i === 0}
            isLast={i === slots.length - 1}
            hasStartPoint={hasStartPoint}
          />
        ))}
      </div>

        <div className="card p-3 text-xs text-zinc-600 text-[var(--ink)]/60 bg-zinc-100 bg-[var(--card)] mt-4">
          <p>
            <strong>Note:</strong> This is a suggested itinerary. Feel free to adjust times and pace to match your rhythm.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
