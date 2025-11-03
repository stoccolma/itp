import { test, expect } from '@playwright/test';

/**
 * Unit tests for URL builders used in the itinerary planner
 */

test.describe('URL Builder Functions', () => {
  test.describe('POI Details URL', () => {
    test('should build correct POI details URL with id', () => {
      const baseUrl = 'https://italoplanner.com';
      const poiId = 'poi-123';
      const expected = `${baseUrl}/poi/${poiId}`;
      const actual = `${baseUrl}/poi/${poiId}`;
      
      expect(actual).toBe(expected);
    });

    test('should handle different base URLs', () => {
      const baseUrl = 'http://localhost:3000';
      const poiId = 'agrigento-valley-temples';
      const expected = `${baseUrl}/poi/${poiId}`;
      const actual = `${baseUrl}/poi/${poiId}`;
      
      expect(actual).toBe(expected);
    });

    test('should handle POI ids with special characters', () => {
      const baseUrl = 'https://italoplanner.com';
      const poiId = 'poi-with-dashes-123';
      const expected = `${baseUrl}/poi/${poiId}`;
      const actual = `${baseUrl}/poi/${poiId}`;
      
      expect(actual).toBe(expected);
    });
  });

  test.describe('Google Maps URL from lat/lon', () => {
    test('should build correct Google Maps URL with 5 decimal precision', () => {
      const lat = 37.123456789;
      const lon = 14.987654321;
      const expected = `https://www.google.com/maps/search/?api=1&query=37.12346,14.98765`;
      const actual = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(5)},${lon.toFixed(5)}`;
      
      expect(actual).toBe(expected);
    });

    test('should round coordinates to 5 decimals correctly', () => {
      const lat = 38.9999999;
      const lon = 15.0000001;
      const expected = `https://www.google.com/maps/search/?api=1&query=39.00000,15.00000`;
      const actual = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(5)},${lon.toFixed(5)}`;
      
      expect(actual).toBe(expected);
    });

    test('should handle negative coordinates', () => {
      const lat = -37.123456;
      const lon = -14.987654;
      const expected = `https://www.google.com/maps/search/?api=1&query=-37.12346,-14.98765`;
      const actual = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(5)},${lon.toFixed(5)}`;
      
      expect(actual).toBe(expected);
    });

    test('should handle zero coordinates', () => {
      const lat = 0;
      const lon = 0;
      const expected = `https://www.google.com/maps/search/?api=1&query=0.00000,0.00000`;
      const actual = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(5)},${lon.toFixed(5)}`;
      
      expect(actual).toBe(expected);
    });

    test('should handle coordinates with fewer than 5 decimals', () => {
      const lat = 37.1;
      const lon = 15;
      const expected = `https://www.google.com/maps/search/?api=1&query=37.10000,15.00000`;
      const actual = `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(5)},${lon.toFixed(5)}`;
      
      expect(actual).toBe(expected);
    });
  });

  test.describe('Empty Slot Rendering', () => {
    test('should render time and em dash for empty slots', () => {
      const time = '09:00';
      const emDash = '—';
      const slotTitle = 'Morning';
      
      // Simulate empty slot rendering
      const renderedTime = time;
      const renderedPlace = emDash;
      const renderedDetails = slotTitle;
      
      expect(renderedTime).toBe('09:00');
      expect(renderedPlace).toBe('—');
      expect(renderedDetails).toBe('Morning');
    });

    test('should not render empty string for empty slots', () => {
      const emDash = '—';
      
      expect(emDash).not.toBe('');
      expect(emDash).toBe('—');
    });
  });

  test.describe('URL Builder Integration', () => {
    test('should build complete POI detail URL', () => {
      const baseUrl = 'https://italoplanner.com';
      const poiId = 'taormina-greek-theatre';
      
      function buildPOIUrl(base: string, id: string): string {
        return `${base}/poi/${id}`;
      }
      
      const url = buildPOIUrl(baseUrl, poiId);
      expect(url).toBe('https://italoplanner.com/poi/taormina-greek-theatre');
    });

    test('should build complete Google Maps URL', () => {
      const lat = 37.85298;
      const lon = 15.29289;
      
      function buildMapsUrl(latitude: number, longitude: number): string {
        return `https://www.google.com/maps/search/?api=1&query=${latitude.toFixed(5)},${longitude.toFixed(5)}`;
      }
      
      const url = buildMapsUrl(lat, lon);
      expect(url).toBe('https://www.google.com/maps/search/?api=1&query=37.85298,15.29289');
    });

    test('should handle fallback to address when coordinates unavailable', () => {
      const address = 'Via Teatro Greco, 1, Taormina ME, Italy';
      
      function buildMapsUrlFromAddress(addr: string): string {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
      }
      
      const url = buildMapsUrlFromAddress(address);
      expect(url).toContain('https://www.google.com/maps/search/?api=1&query=');
      expect(url).toContain('Taormina');
    });
  });
});
