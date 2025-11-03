import { test, expect } from '@playwright/test';

test.describe('MapLibre Layer Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to page with a valid area and today's date
    const today = new Date().toISOString().split('T')[0];
    await page.goto(`http://localhost:3000/?from=palermo&date=${today}`);
    
    // Wait for map to be visible
    await page.waitForSelector('[data-map-section]', { timeout: 10000 });
    
    // Wait a bit for MapLibre to initialize
    await page.waitForTimeout(2000);
  });

  test('should have POI and area layers in default Satellite style', async ({ page }) => {
    // Check that map is loaded by looking for the map container
    const mapContainer = await page.locator('[data-map-section]').first();
    await expect(mapContainer).toBeVisible();
    
    // Get map layers using __italoLayers helper
    const layerIds = await page.evaluate(() => {
      // @ts-ignore - test-only handle
      if (!(window as any).__italoLayers) {
        console.warn('Test helpers not available - skipping layer test');
        return null;
      }
      return (window as any).__italoLayers();
    });
    
    expect(layerIds).not.toBeNull();
    expect(Array.isArray(layerIds)).toBeTruthy();
    
    // Get full layer info for type checking
    const layers = await page.evaluate(() => {
      const map = (window as any).__italoMap;
      if (!map) return null;
      const style = map.getStyle();
      return style.layers.map((l: any) => ({ id: l.id, type: l.type }));
    });
    
    expect(layers).not.toBeNull();
    expect(Array.isArray(layers)).toBeTruthy();
    
    // Check for area layers
    const areaCircles = layers?.find((l: any) => l.id === 'areas-circles');
    const areaLabels = layers?.find((l: any) => l.id === 'areas-labels');
    
    expect(areaCircles).toBeDefined();
    expect(areaCircles?.type).toBe('circle');
    expect(areaLabels).toBeDefined();
    expect(areaLabels?.type).toBe('symbol');
    
    // Check for POI layers (using new naming: poi-*)
    const poiClusters = layers?.find((l: any) => l.id === 'poi-clusters');
    const poiClusterCount = layers?.find((l: any) => l.id === 'poi-cluster-count');
    const poiPoints = layers?.find((l: any) => l.id === 'poi-points');
    
    expect(poiClusters).toBeDefined();
    expect(poiClusters?.type).toBe('circle');
    expect(poiClusterCount).toBeDefined();
    expect(poiClusterCount?.type).toBe('symbol');
    expect(poiPoints).toBeDefined();
    expect(poiPoints?.type).toBe('circle');
    
    console.log(`✅ Satellite style has all required layers (${layers?.length} total)`);
  });

  test('should maintain layers after switching to Dark style', async ({ page }) => {
    // Wait for map to load
    await page.waitForTimeout(2000);
    
    // Find and click the style dropdown using test ID
    const styleSelect = await page.getByTestId('map-style');
    await expect(styleSelect).toBeVisible();
    
    // Switch to Dark style
    await styleSelect.selectOption('Dark');
    
    // Poll for layers to repopulate after style change
    let layerIds: string[] | null = null;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(200);
      layerIds = await page.evaluate(() => {
        if (!(window as any).__italoLayers) return null;
        return (window as any).__italoLayers();
      });
      
      // Check if our custom layers are present
      if (layerIds && layerIds.includes('poi-points') && layerIds.includes('areas-circles')) {
        break;
      }
    }
    
    expect(layerIds).not.toBeNull();
    expect(layerIds).toContain('poi-points');
    expect(layerIds).toContain('poi-clusters');
    expect(layerIds).toContain('areas-circles');
    
    // Get full layer info for type checking
    const layers = await page.evaluate(() => {
      const map = (window as any).__italoMap;
      if (!map) return null;
      const style = map.getStyle();
      return style.layers.map((l: any) => ({ id: l.id, type: l.type }));
    });
    
    expect(layers).not.toBeNull();
    
    // Check for area layers in Dark style
    const areaCircles = layers?.find((l: any) => l.id === 'areas-circles');
    const areaLabels = layers?.find((l: any) => l.id === 'areas-labels');
    
    expect(areaCircles).toBeDefined();
    expect(areaLabels).toBeDefined();
    
    // Check for POI layers in Dark style (using new naming: poi-*)
    const poiClusters = layers?.find((l: any) => l.id === 'poi-clusters');
    const poiClusterCount = layers?.find((l: any) => l.id === 'poi-cluster-count');
    const poiPoints = layers?.find((l: any) => l.id === 'poi-points');
    
    expect(poiClusters).toBeDefined();
    expect(poiClusterCount).toBeDefined();
    expect(poiPoints).toBeDefined();
    
    console.log(`✅ Dark style has all required layers (${layers?.length} total)`);
  });

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait for map to fully load
    await page.waitForTimeout(3000);
    
    // Check for errors (filter out known benign errors)
    const criticalErrors = errors.filter(err => 
      !err.includes('DevTools') && 
      !err.includes('extension') &&
      !err.includes('hero.jpg') // Known missing image
    );
    
    if (criticalErrors.length > 0) {
      console.log('❌ Console errors found:', criticalErrors);
    } else {
      console.log('✅ No critical console errors');
    }
    
    expect(criticalErrors.length).toBe(0);
  });

  test('should reset map to home bounds', async ({ page }) => {
    // Wait for map
    await page.waitForTimeout(2000);
    
    // Get initial state
    const beforeReset = await page.evaluate(() => {
      const map = (window as any).__italoMap;
      if (!map) return null;
      return {
        zoom: map.getZoom(),
        center: map.getCenter()
      };
    });
    
    // Click reset button using test ID
    await page.getByTestId('map-reset').click();
    await page.waitForTimeout(1500); // Wait for animation
    
    // Check state after reset
    const afterReset = await page.evaluate(() => {
      const map = (window as any).__italoMap;
      if (!map) return null;
      
      const zoom = map.getZoom();
      const center = map.getCenter();
      const style = map.getStyle();
      const areaCircles = style.layers.find((l: any) => l.id === 'areas-circles');
      
      return {
        zoom,
        center: { lng: center.lng, lat: center.lat },
        hasLayer: !!areaCircles,
        minzoom: areaCircles?.minzoom,
        maxzoom: areaCircles?.maxzoom
      };
    });
    
    expect(afterReset).not.toBeNull();
    expect(afterReset?.hasLayer).toBeTruthy();
    expect(afterReset?.minzoom).toBe(6);
    expect(afterReset?.maxzoom).toBe(10.5);
    
    // Check that center is near Sicily centroid (~13.9, 37.0)
    expect(afterReset?.center.lng).toBeGreaterThan(13.0);
    expect(afterReset?.center.lng).toBeLessThan(15.0);
    expect(afterReset?.center.lat).toBeGreaterThan(36.5);
    expect(afterReset?.center.lat).toBeLessThan(38.0);
    
    // Check that zoom is reasonable for Sicily view
    expect(afterReset?.zoom).toBeGreaterThan(6);
    expect(afterReset?.zoom).toBeLessThan(9);
    
    console.log(`✅ Reset works correctly (zoom ${afterReset?.zoom?.toFixed(1)}, center [${afterReset?.center.lng.toFixed(2)}, ${afterReset?.center.lat.toFixed(2)}])`);
  });
});
