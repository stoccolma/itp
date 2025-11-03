'use client';

import { useEffect } from 'react';

/**
 * DevGuard - Development-only debugging utilities
 * This component overrides document.write to log stack traces,
 * helping catch issues that could break the application.
 */
export default function DevGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const orig = document.write.bind(document);
      document.write = (...args: string[]) => {
        console.warn('document.write called. This will break things.', args, new Error().stack);
        orig(...args);
      };
      
      console.info('[DevGuard] document.write override installed');
    }
  }, []);

  return null;
}
