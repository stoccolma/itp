/**
 * Configuration and feature flags for ItaloPlanner
 */

// Site configuration
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const IS_STAGING = SITE_URL.includes('staging');

// Backend configuration
export const EDITORIAL_BACKEND = process.env.EDITORIAL_BACKEND || 'fs';

// POI Backend: 'csv' | 'base44'
export const POI_BACKEND = (process.env.POI_BACKEND || 'csv') as 'csv' | 'base44';

// Base44 API configuration
export const BASE44_API_URL = process.env.BASE44_API_URL || '';
export const BASE44_API_KEY = process.env.BASE44_API_KEY || '';

// Plan shortlink configuration
export const PLAN_SHORTLINK_TTL_DAYS = Number(process.env.PLAN_SHORTLINK_TTL_DAYS || 30);

// Analytics configuration
export const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS === 'on';

// Admin configuration
export const ADMIN_KEY = process.env.ADMIN_KEY || '';

/**
 * Validation helpers
 */
export function isBase44Configured(): boolean {
  return POI_BACKEND === 'base44' && !!BASE44_API_URL && !!BASE44_API_KEY;
}

export function shouldUseBase44POI(): boolean {
  return POI_BACKEND === 'base44' && isBase44Configured();
}

/**
 * Log configuration on startup (server-side only)
 */
if (typeof window === 'undefined') {
  console.log('🔧 ItaloPlanner Configuration:');
  console.log('  - Site URL:', SITE_URL);
  console.log('  - Staging:', IS_STAGING);
  console.log('  - POI Backend:', POI_BACKEND);
  console.log('  - Base44 Configured:', isBase44Configured());
  console.log('  - Editorial Backend:', EDITORIAL_BACKEND);
  console.log('  - Shortlink TTL:', PLAN_SHORTLINK_TTL_DAYS, 'days');
}
