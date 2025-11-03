/**
 * Shortlink generation and validation utilities
 */

import { PLAN_SHORTLINK_TTL_DAYS } from './config';

// Base62 alphabet (alphanumeric: 0-9, a-z, A-Z)
const BASE62_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generate a random base62 code
 * @param length Length of the code (default: 6)
 */
export function generateShortCode(length: number = 6): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * BASE62_ALPHABET.length);
    code += BASE62_ALPHABET[randomIndex];
  }
  return code;
}

/**
 * Check if a shortlink is expired
 */
export function isShortlinkExpired(createdAt: Date, ttlDays: number): boolean {
  const now = new Date();
  const expiryDate = new Date(createdAt);
  expiryDate.setDate(expiryDate.getDate() + ttlDays);
  return now > expiryDate;
}

/**
 * Validate a URL for shortlink creation
 * Must be HTTPS and same origin
 */
export function validateShortlinkUrl(url: string, siteUrl: string): { valid: boolean; error?: string } {
  try {
    const urlObj = new URL(url);
    const siteUrlObj = new URL(siteUrl);
    
    // Must be same origin
    if (urlObj.origin !== siteUrlObj.origin) {
      return {
        valid: false,
        error: 'URL must be from the same origin'
      };
    }
    
    // Allow both http (local dev) and https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return {
        valid: false,
        error: 'URL must use HTTP or HTTPS protocol'
      };
    }
    
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid URL format'
    };
  }
}

/**
 * Calculate expiry date for a shortlink
 */
export function getShortlinkExpiryDate(createdAt: Date, ttlDays: number): Date {
  const expiry = new Date(createdAt);
  expiry.setDate(expiry.getDate() + ttlDays);
  return expiry;
}
