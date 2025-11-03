'use client';

import dynamic from 'next/dynamic';

const ItaloMap = dynamic(() => import('./ItaloMap'), { ssr: false });

interface AreaPoint {
  id: string;
  name: string;
  lon: number;
  lat: number;
}

interface ItaloMapWrapperProps {
  areas: AreaPoint[];
}

export default function ItaloMapWrapper({ areas }: ItaloMapWrapperProps) {
  return <ItaloMap areas={areas} />;
}
