'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import AreaStaticMap from './AreaStaticMap';
import type { AreaFull } from '@/lib/areas';

interface CollapsibleMapProps {
  area: AreaFull;
  neighbors: AreaFull[];
}

export default function CollapsibleMap({ area, neighbors }: CollapsibleMapProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-[var(--stone2)] hover:bg-opacity-20 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--stone)]"
        aria-expanded={isOpen}
        aria-controls="map-content"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-[var(--ink)]">Location</h3>
          <span className="text-xs opacity-60">{area.name}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 opacity-70" />
        ) : (
          <ChevronDown className="w-5 h-5 opacity-70" />
        )}
      </button>
      
      <div
        id="map-content"
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{
          maxHeight: isOpen ? '600px' : '0',
        }}
        aria-hidden={!isOpen}
      >
        <div className="p-4 pt-0">
          <AreaStaticMap area={area} neighbors={neighbors} />
        </div>
      </div>
    </div>
  );
}
