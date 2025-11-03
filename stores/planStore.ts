import { create } from 'zustand';

// City type
export type CitySlug = 'palermo' | 'agrigento' | 'noto' | 'siracusa' | 'catania' | 'taormina';

// Bounding boxes for each city [[lngSW, latSW], [lngNE, latNE]]
export const CITY_BBOX: Record<CitySlug, [[number, number], [number, number]]> = {
  palermo: [[13.270, 38.035], [13.460, 38.180]],
  catania: [[15.020, 37.460], [15.130, 37.540]],
  taormina: [[15.250, 37.820], [15.310, 37.870]],
  siracusa: [[15.230, 37.010], [15.330, 37.100]],
  noto: [[15.020, 36.830], [15.110, 36.900]],
  agrigento: [[13.510, 37.260], [13.650, 37.370]]
};

// Starting point type
export type StartAnchor = {
  type: 'city_center' | 'custom_address' | 'map_point' | null;
  lat?: number;
  lon?: number;
  name?: string;
};

// Stop type (for planned itinerary stops)
export interface Stop {
  id: string;
  name: string;
  type: string;
  time?: string;
  duration?: number;
  lat?: number;
  lon?: number;
}

// Sidequest type (for optional activities)
export interface Sidequest {
  id: string;
  name: string;
  walkMinutes?: number;
  walkMeters?: number;
  lat?: number;
  lon?: number;
  type?: string;
}

// Plan store state
interface PlanStore {
  city: CitySlug | null;
  dateISO: string | null;
  stops: Stop[];
  sidequests: Sidequest[];
  startAnchor: StartAnchor;
  
  // Actions
  setCity: (city: CitySlug | null) => void;
  setDateISO: (date: string | null) => void;
  addSidequest: (sidequest: Sidequest) => void;
  removeSidequest: (id: string) => void;
  moveSidequest: (id: string, direction: 'up' | 'down') => void;
  setStops: (stops: Stop[]) => void;
  setStartAnchor: (anchor: StartAnchor) => void;
  resetSelection: () => void;
}

export const usePlanStore = create<PlanStore>((set) => ({
  city: null,
  dateISO: null,
  stops: [],
  sidequests: [],
  startAnchor: { type: null },
  
  setCity: (city) => set({ city }),
  
  setDateISO: (dateISO) => set({ dateISO }),
  
  setStartAnchor: (anchor) => set({ startAnchor: anchor }),
  
  addSidequest: (sidequest) => 
    set((state) => ({
      sidequests: [...state.sidequests, sidequest]
    })),
  
  removeSidequest: (id) =>
    set((state) => ({
      sidequests: state.sidequests.filter((sq) => sq.id !== id)
    })),
  
  moveSidequest: (id, direction) =>
    set((state) => {
      const index = state.sidequests.findIndex((sq) => sq.id === id);
      if (index === -1) return state;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= state.sidequests.length) return state;
      
      const newSidequests = [...state.sidequests];
      [newSidequests[index], newSidequests[newIndex]] = 
        [newSidequests[newIndex], newSidequests[index]];
      
      return { sidequests: newSidequests };
    }),
  
  setStops: (stops) => set({ stops }),
  
  resetSelection: () => set({ 
    city: null, 
    dateISO: null, 
    stops: [], 
    sidequests: [],
    startAnchor: { type: null }
  })
}));
