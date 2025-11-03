'use client';

import { useState, useEffect, useRef } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import DayPlanner from '@/components/DayPlanner';
import DraggablePOIList from '@/components/DraggablePOIList';
import QuickStops from '@/components/QuickStops';
import type { PlanSlot, Sidequest } from '@/lib/plan-utils';
import type { POI } from '@/lib/pois';

// Helper to fetch full POI data by ID
async function fetchPOIById(id: string): Promise<POI | null> {
  try {
    const response = await fetch(`/api/pois?bbox=-180,-90,180,90`);
    if (!response.ok) return null;
    
    const data = await response.json();
    const feature = data.features?.find((f: any) => f.properties.id === id);
    
    if (!feature) return null;
    
    return {
      id: feature.properties.id,
      name: feature.properties.name,
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      category: feature.properties.category,
      area_slug: feature.properties.area_slug,
      address: feature.properties.address,
      addressLine1: feature.properties.address_line1,
      locality: feature.properties.locality,
      region: feature.properties.region,
      postcode: feature.properties.postcode,
      short_desc: feature.properties.short_desc,
      timing: feature.properties.timing,
      tags: feature.properties.tags,
    };
  } catch (error) {
    console.error('Failed to fetch POI:', error);
    return null;
  }
}

interface DayPlannerWrapperProps {
  initialSlots: PlanSlot[];
  dateISO: string;
  areaName: string;
  nearbyPlaces: Array<{ id: string; name: string; dist: number }>;
}

export default function DayPlannerWrapper({
  initialSlots,
  dateISO,
  areaName,
  nearbyPlaces
}: DayPlannerWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [slots, setSlots] = useState<PlanSlot[]>(initialSlots);
  const [sidequests, setSidequests] = useState<Sidequest[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  // Time picker modal state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pendingPOI, setPendingPOI] = useState<{ id: string; name: string; dist: number; lat: number; lon: number } | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  
  // Refs for autoscroll
  const plannerScrollRef = useRef<HTMLDivElement>(null);
  const poiScrollRef = useRef<HTMLDivElement>(null);
  const sidequestScrollRef = useRef<HTMLDivElement>(null);
  const autoscrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storageKey = `planner-${areaName}-${dateISO}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const savedData = JSON.parse(saved);
        if (savedData.slots) {
          setSlots(savedData.slots);
        } else {
          // Backward compatibility with old format
          setSlots(savedData);
        }
        if (savedData.sidequests) {
          setSidequests(savedData.sidequests);
        }
      } catch (e) {
        console.error('Failed to load saved plan:', e);
      }
    }
    setMounted(true);
  }, [areaName, dateISO]);

  // Dev guards - diagnostic checks for layout regressions
  useEffect(() => {
    if (mounted && process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        // Guard 1: Check if Sidequests is inside right column
        const sidequestsEl = document.querySelector('[data-testid="sidequests"]');
        const insideRightCol = !!document.querySelector('.md\\:col-span-5 [data-testid="sidequests"]');
        
        if (sidequestsEl && !insideRightCol) {
          console.error('❌ REGRESSION: Sidequests is NOT inside the right column!');
        }
        
        // Guard 2: Check for overflow-y-auto on Sidequests itself
        if (sidequestsEl) {
          const computedStyle = getComputedStyle(sidequestsEl);
          if (computedStyle.overflowY !== 'visible') {
            console.warn('⚠️ Sidequests should not scroll - it has overflowY:', computedStyle.overflowY);
          }
        }
        
        // Guard 3: Warn if more than two .overflow-y-auto in planner section
        const plannerSection = document.querySelector('#planner-root');
        if (plannerSection) {
          const scrollers = plannerSection.querySelectorAll('.overflow-y-auto');
          if (scrollers.length > 2) {
            console.warn(`⚠️ Found ${scrollers.length} scrollers (expected exactly 2):`, scrollers);
          }
        }
        
        // Debug summary
        console.debug('DEV GUARDS CHECK', {
          sidequestsInsideRightCol: insideRightCol,
          totalScrollers: document.querySelectorAll('.overflow-y-auto').length,
          plannerScrollers: plannerSection?.querySelectorAll('.overflow-y-auto').length,
          sidequestsOverflow: sidequestsEl ? getComputedStyle(sidequestsEl).overflowY : 'N/A'
        });
      }, 100);
    }
  }, [mounted]);

  // Save to localStorage when slots or sidequests change
  useEffect(() => {
    const storageKey = `planner-${areaName}-${dateISO}`;
    localStorage.setItem(storageKey, JSON.stringify({ slots, sidequests }));
  }, [slots, sidequests, areaName, dateISO]);

  // Configure sensors for drag detection (both mouse and keyboard)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        // Reduce delay for touch to make mobile drag more responsive
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    // Prevent map from interfering during drag
    document.body.dataset.dragging = 'true';
    startAutoscroll();
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over?.id as string | null);
  };

  // Autoscroll functionality
  const startAutoscroll = () => {
    if (autoscrollInterval.current) return;
    
    autoscrollInterval.current = setInterval(() => {
      const scrollContainers = [plannerScrollRef.current, poiScrollRef.current, sidequestScrollRef.current];
      
      scrollContainers.forEach(container => {
        if (!container) return;
        
        const rect = container.getBoundingClientRect();
        const scrollThreshold = 100; // pixels from edge to trigger scroll
        const scrollSpeed = 10; // pixels per interval
        
        // Check mouse position relative to container
        const mouseY = (window as any).__dragMouseY || 0;
        
        if (mouseY > 0) { // Only scroll if we have a valid mouse position
          // Scroll down if near bottom
          if (mouseY > rect.bottom - scrollThreshold && mouseY < rect.bottom) {
            container.scrollTop += scrollSpeed;
          }
          // Scroll up if near top
          else if (mouseY < rect.top + scrollThreshold && mouseY > rect.top) {
            container.scrollTop -= scrollSpeed;
          }
        }
      });
    }, 50);
    
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      (window as any).__dragMouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  };

  const stopAutoscroll = () => {
    if (autoscrollInterval.current) {
      clearInterval(autoscrollInterval.current);
      autoscrollInterval.current = null;
    }
    delete (window as any).__dragMouseY;
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);
    stopAutoscroll();
    // Re-enable map interactions
    delete document.body.dataset.dragging;

    if (!over) return;

    const droppedData = active.data.current;
    if (!droppedData) return;

    const targetId = over.id as string;
    const targetData = over.data?.current;

    // Handle dropping INTO sidequests zone
    if (targetId === 'sidequests-drop-zone') {
      // If it's a POI from the list
      if (droppedData.id && droppedData.name) {
        // Calculate default time (+20 min from last sidequest or last slot)
        const lastSidequest = sidequests.length > 0 
          ? sidequests[sidequests.length - 1] 
          : null;
        const lastSlot = slots.filter(s => s.poi).pop();
        
        let defaultTime = '10:00';
        if (lastSidequest) {
          const [h, m] = lastSidequest.time.split(':').map(Number);
          const totalMin = h * 60 + m + 20;
          defaultTime = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
        } else if (lastSlot) {
          const [h, m] = lastSlot.time.split(':').map(Number);
          const totalMin = h * 60 + m + 20;
          defaultTime = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
        }
        
        setSelectedTime(defaultTime);
        setPendingPOI({
          id: droppedData.id,
          name: droppedData.name,
          dist: droppedData.dist || 0,
          lat: droppedData.lat || 0,
          lon: droppedData.lon || 0
        });
        setShowTimePicker(true);
        return;
      }
      
      // If it's a sidequest being moved within sidequests, ignore
      if (droppedData.type === 'sidequest') {
        return;
      }
    }

    // Handle dropping FROM sidequests INTO main slots
    if (droppedData.type === 'sidequest' && targetId.startsWith('slot-')) {
      const sidequest = droppedData.sidequest as Sidequest;
      const targetSlot = slots.find(s => s.id === targetId);
      if (!targetSlot) return;

      // Fetch full POI data
      const fullPOI = await fetchPOIById(sidequest.poiId);
      if (!fullPOI) {
        setToast('Failed to load POI details');
        setTimeout(() => setToast(null), 2000);
        return;
      }

      // Update slot with address fields copied from POI
      setSlots(prevSlots => prevSlots.map(slot => {
        if (slot.id === targetId) {
          return {
            ...slot,
            poi: fullPOI,
            distance: sidequest.distance,
            addressLine1: fullPOI.addressLine1,
            locality: fullPOI.locality,
            region: fullPOI.region,
            postcode: fullPOI.postcode
          };
        }
        return slot;
      }));

      // Remove from sidequests
      setSidequests(prev => prev.filter(sq => sq.id !== sidequest.id));
      
      setToast(`Promoted to ${targetSlot.time}`);
      setTimeout(() => setToast(null), 2000);
      return;
    }

    // Handle dropping POI into main slots (original logic)
    if (targetId.startsWith('slot-')) {
      const targetSlot = slots.find(s => s.id === targetId);
      if (!targetSlot) return;

      // Prevent duplicate in same slot
      if (targetSlot.poi?.id === droppedData.id) {
        setToast('Already in this slot');
        setTimeout(() => setToast(null), 2000);
        return;
      }

      // Prevent duplicate across ALL slots (check if POI is already used anywhere)
      const alreadyUsed = slots.some(slot => slot.poi?.id === droppedData.id);
      if (alreadyUsed) {
        setToast('This place is already in your plan');
        setTimeout(() => setToast(null), 2000);
        return;
      }

      // Fetch full POI data
      const fullPOI = await fetchPOIById(droppedData.id);
      if (!fullPOI) {
        setToast('Failed to load POI details');
        setTimeout(() => setToast(null), 2000);
        return;
      }

      // Debug logging
      console.log('DROP', { 
        over: over.id, 
        active: active.id, 
        poi: fullPOI 
      });

      // Update slots with full POI data and copy address fields
      setSlots(prevSlots => {
        const newSlots = prevSlots.map(slot => {
          if (slot.id === targetId) {
            return {
              ...slot,
              poi: fullPOI,
              distance: droppedData.dist,
              addressLine1: fullPOI.addressLine1,
              locality: fullPOI.locality,
              region: fullPOI.region,
              postcode: fullPOI.postcode
            };
          }
          return slot;
        });
        return newSlots;
      });

      // Show success toast with time
      setToast(`✓ Added to ${targetSlot.time}`);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setOverId(null);
    stopAutoscroll();
    // Re-enable map interactions
    delete document.body.dataset.dragging;
  };
  
  // Cleanup autoscroll on unmount
  useEffect(() => {
    return () => stopAutoscroll();
  }, []);

  // Handle adding sidequest with time
  const handleAddSidequest = async () => {
    if (!pendingPOI || !selectedTime) return;
    
    // Fetch full POI data to get address fields
    const fullPOI = await fetchPOIById(pendingPOI.id);
    
    const newSidequest: Sidequest = {
      id: `sidequest-${Date.now()}`,
      poiId: pendingPOI.id,
      name: pendingPOI.name,
      lat: pendingPOI.lat,
      lon: pendingPOI.lon,
      time: selectedTime,
      distance: pendingPOI.dist,
      addressLine1: fullPOI?.addressLine1,
      locality: fullPOI?.locality,
      region: fullPOI?.region,
      postcode: fullPOI?.postcode
    };
    
    setSidequests(prev => [...prev, newSidequest]);
    setShowTimePicker(false);
    setPendingPOI(null);
    setSelectedTime('');
    setToast(`Added "${pendingPOI.name}" to sidequests`);
    setTimeout(() => setToast(null), 2000);
  };

  const handleRemoveSidequest = (id: string) => {
    setSidequests(prev => prev.filter(sq => sq.id !== id));
    setToast('Removed from sidequests');
    setTimeout(() => setToast(null), 2000);
  };

  const handleUpdateSidequestTime = (id: string, time: string) => {
    setSidequests(prev => prev.map(sq => 
      sq.id === id ? { ...sq, time } : sq
    ));
  };

  // Extract the POI ID from the draggable ID format (poi-{id})
  const poiId = activeId?.startsWith('poi-') ? activeId.substring(4) : activeId;
  const activePOI = poiId ? nearbyPlaces.find(p => p.id === poiId) : null;

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      autoScroll
    >
      {/* Grid wrapper - 12-col on large screens, stacked on mobile */}
      <section id="planner-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column - Timeline (Day Planner) */}
        <div 
          id="planner-col"
          ref={plannerScrollRef}
          className="lg:col-span-7 flex flex-col min-h-0 overflow-y-auto"
        >
          <DayPlanner
            initialSlots={slots}
            dateISO={dateISO}
            areaName={areaName}
            onSlotsChange={setSlots}
            sidequests={sidequests}
          />
        </div>

        {/* Right Column - Nearby + Quick Stops (Sidequests) */}
        <aside 
          id="right-col"
          ref={poiScrollRef}
          className="lg:col-span-5 flex flex-col gap-4 min-h-0 overflow-y-auto"
        >
          <DraggablePOIList items={nearbyPlaces} />
          <QuickStops 
            data-testid="sidequests"
            quickStops={sidequests}
            onAdd={handleAddSidequest}
            onRemove={handleRemoveSidequest}
            onUpdateTime={handleUpdateSidequestTime}
          />
        </aside>
      </section>

      {/* Drag Overlay - Shows dragged item as ghost preview */}
      <DragOverlay>
        {activePOI ? (
          <div className="card p-3 bg-white bg-[var(--card)] shadow-2xl opacity-80 cursor-grabbing border-2 border-emerald-400 dark:border-emerald-500 transform rotate-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-900 text-[var(--ink)]">
                  {activePOI.name}
                </h4>
                {(activePOI as any).category && (
                  <p className="text-xs text-zinc-500 text-[var(--ink)]/60 mt-0.5">
                    {(activePOI as any).category}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Time Picker Modal */}
      {showTimePicker && pendingPOI && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white bg-[var(--card)] rounded-lg p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-zinc-900 text-[var(--ink)] mb-2">
              Set Time for Sidequest
            </h3>
            <p className="text-sm text-zinc-600 text-[var(--ink)]/60 mb-4">
              {pendingPOI.name}
            </p>
            
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Time (HH:MM)
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 border-[var(--line)] bg-white text-zinc-900 text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-zinc-500"
              autoFocus
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowTimePicker(false);
                  setPendingPOI(null);
                  setSelectedTime('');
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 border-[var(--line)] text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSidequest}
                disabled={!selectedTime}
                className="flex-1 px-4 py-2 rounded-lg bg-zinc-900 bg-[var(--card)] text-zinc-50 hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 bg-[var(--card)] text-zinc-50 px-4 py-2 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-bottom-2">
          <p className="text-sm font-medium">{toast}</p>
        </div>
      )}
    </DndContext>
  );
}
