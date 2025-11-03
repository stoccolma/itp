'use client';

import { useEffect, useState } from 'react';

export function StagingBanner() {
  const [isStaging, setIsStaging] = useState(false);

  useEffect(() => {
    // Check if we're on a staging URL
    if (typeof window !== 'undefined') {
      setIsStaging(window.location.hostname.includes('staging'));
    }
  }, []);

  if (!isStaging) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-medium">
      ⚠️ Staging Build • Not for production use
    </div>
  );
}
