'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { AreaFull } from '@/lib/areas';

interface PlannerState {
  startArea: string | null;
  startDate: string | null;
  areaData: AreaFull | null;
}

interface PlannerContextType extends PlannerState {
  setStartArea: (slug: string) => void;
  setStartDate: (date: string) => void;
  setAreaData: (data: AreaFull | null) => void;
  canStart: boolean;
  reset: () => void;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [startArea, setStartArea] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [areaData, setAreaData] = useState<AreaFull | null>(null);

  const canStart = !!(startArea && startDate);

  const reset = () => {
    setStartArea(null);
    setStartDate(null);
    setAreaData(null);
  };

  return (
    <PlannerContext.Provider
      value={{
        startArea,
        startDate,
        areaData,
        setStartArea,
        setStartDate,
        setAreaData,
        canStart,
        reset
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (context === undefined) {
    throw new Error('usePlanner must be used within a PlannerProvider');
  }
  return context;
}
