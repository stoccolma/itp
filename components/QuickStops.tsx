'use client';

import { useState } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import type { Sidequest } from '@/lib/plan';

interface QuickStopsProps {
  quickStops: Sidequest[];
  onAdd: (quickStop: Sidequest) => void;
  onRemove: (id: string) => void;
  onUpdateTime: (id: string, time: string) => void;
}

function DraggableQuickStop({
  quickStop, 
  onRemove,
  onUpdateTime 
}: { 
  quickStop: Sidequest;
  onRemove: (id: string) => void;
  onUpdateTime: (id: string, time: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidequest-${quickStop.id}`,
    data: {
      type: 'sidequest',
      sidequest: quickStop
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const [isEditingTime, setIsEditingTime] = useState(false);
  const [tempTime, setTempTime] = useState(quickStop.time);

  const handleTimeSubmit = () => {
    if (tempTime && /^\d{2}:\d{2}$/.test(tempTime)) {
      onUpdateTime(quickStop.id, tempTime);
    }
    setIsEditingTime(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white bg-[var(--card)] border border-zinc-300 border-[var(--line)] text-sm cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'shadow-lg ring-2 ring-zinc-400' : 'hover:shadow-sm'
      }`}
    >
      {isEditingTime ? (
        <input
          type="time"
          value={tempTime}
          onChange={(e) => setTempTime(e.target.value)}
          onBlur={handleTimeSubmit}
          onKeyDown={(e) => e.key === 'Enter' && handleTimeSubmit()}
          className="w-16 text-xs font-mono px-1 py-0.5 rounded border border-zinc-300 border-[var(--line)] bg-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditingTime(true);
          }}
          className="text-xs font-mono text-zinc-600 text-[var(--ink)]/60 hover:text-zinc-900"
        >
          {quickStop.time}
        </button>
      )}
      
      <span className="text-zinc-400 text-[var(--ink)]0">•</span>
      
      <span className="font-medium text-zinc-900 text-[var(--ink)]">
        {quickStop.name}
      </span>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(quickStop.id);
        }}
        className="ml-1 p-0.5 rounded-full hover:bg-red-100 text-red-600 focus:outline-none"
        aria-label="Remove quick stop"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function QuickStops({ 
  quickStops, 
  onAdd, 
  onRemove,
  onUpdateTime 
}: QuickStopsProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'sidequests-drop-zone',
    data: { type: 'sidequests' }
  });

  // Sort quick stops by time
  const sortedQuickStops = [...quickStops].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  return (
    <div data-testid="sidequests" className="space-y-2">
      <h3 className="text-sm font-semibold text-zinc-900 text-[var(--ink)]">
        Quick Stops
      </h3>
      
      <div
        ref={setNodeRef}
        className={`rounded-lg border-2 border-dashed transition-colors p-3 min-h-[80px] ${
          isOver 
            ? 'border-zinc-500 bg-zinc-100' 
            : 'border-zinc-300 border-[var(--line)] bg-zinc-50 bg-[var(--paper)]/40'
        }`}
      >
        {sortedQuickStops.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {sortedQuickStops.map((qs) => (
              <DraggableQuickStop
                key={qs.id}
                quickStop={qs}
                onRemove={onRemove}
                onUpdateTime={onUpdateTime}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-zinc-500 text-[var(--ink)]/60">
            {isOver ? (
              <p className="font-medium">Drop here to add</p>
            ) : (
              <p>Drag POIs here for quick stops</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
