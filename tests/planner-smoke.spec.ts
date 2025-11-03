import { test, expect, Page } from '@playwright/test';
import path from 'path';

/**
 * Planner Smoke Tests
 * 
 * These tests verify the core planner functionality:
 * 1. Layout renders correctly with two columns
 * 2. Drag & drop POI to time slot
 * 3. Add POI to sidequests
 * 4. PDF generation
 */

// Helper to wait for hydration and drag-drop readiness
async function waitForPlannerReady(page: Page) {
  // Wait for the planner wrapper to be visible
  await page.waitForSelector('[class*="DayPlanner"]', { timeout: 10000 });
  // Wait for POI list to be visible
  await page.waitForSelector('[class*="DraggablePOI"]', { timeout: 10000 });
  // Small delay to ensure drag-drop is initialized
  await page.waitForTimeout(1000);
}

test.describe('Planner Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set viewport to 1280x720 as specified
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('1. Layout: Two columns visible at 1280x720', async ({ page }) => {
    // Navigate with featured city (palermo) and date
    await page.goto('/?from=palermo&date=2025-10-30');
    
    // Wait for planner to be ready
    await waitForPlannerReady(page);

    // Find the main planner grid/section
    const plannerSection = page.locator('section').filter({ hasText: 'Day Planner' }).first();
    await expect(plannerSection).toBeVisible();

    // Check for Day Planner column (left)
    const dayPlannerColumn = page.locator('[class*="Day Planner"]').or(page.getByText('Day Planner')).first();
    await expect(dayPlannerColumn).toBeVisible();

    // Check for POI list column (right) - look for "Nearby Places" or draggable items
    const poiListColumn = page.locator('[class*="DraggablePOI"]').first().or(
      page.locator('aside').filter({ has: page.locator('[draggable]') }).first()
    );
    await expect(poiListColumn).toBeVisible();

    // Verify both columns are in viewport
    const dayPlannerBox = await dayPlannerColumn.boundingBox();
    const poiListBox = await poiListColumn.boundingBox();
    
    expect(dayPlannerBox).toBeTruthy();
    expect(poiListBox).toBeTruthy();
    
    if (dayPlannerBox && poiListBox) {
      // Both should be visible within the 1280 width
      expect(dayPlannerBox.x).toBeGreaterThanOrEqual(0);
      expect(poiListBox.x + poiListBox.width).toBeLessThanOrEqual(1280);
    }

    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/planner-layout.png', fullPage: true });
  });

  test('2. Comprehensive smoke: Featured city + Two columns + Drag to slot-09:00 + Print', async ({ page }) => {
    // Load home with featured city & date
    await page.goto('/?from=palermo&date=2025-10-30');
    await waitForPlannerReady(page);

    // Assert: Two columns visible at 1280×720
    const leftColumn = page.locator('#planner-col');
    const rightColumn = page.locator('#right-col');
    
    await expect(leftColumn).toBeVisible();
    await expect(rightColumn).toBeVisible();
    
    // Verify both columns are in viewport
    const leftBox = await leftColumn.boundingBox();
    const rightBox = await rightColumn.boundingBox();
    
    expect(leftBox).toBeTruthy();
    expect(rightBox).toBeTruthy();
    
    if (leftBox && rightBox) {
      expect(leftBox.x).toBeGreaterThanOrEqual(0);
      expect(rightBox.x + rightBox.width).toBeLessThanOrEqual(1280);
    }

    // Drag first POI to 'slot-09:00'
    const firstPOI = page.locator('[draggable="true"]').first();
    const slot0900 = page.locator('[id^="slot-"]').filter({ hasText: '09:00' }).first();
    
    await expect(firstPOI).toBeVisible();
    await expect(slot0900).toBeVisible();
    
    const poiName = await firstPOI.textContent();
    
    await firstPOI.dragTo(slot0900, {
      sourcePosition: { x: 10, y: 10 },
      targetPosition: { x: 50, y: 50 }
    });
    
    await page.waitForTimeout(1000);
    
    // Assert it renders in the slot
    const slotContent = slot0900.locator('h3, h4').first();
    await expect(slotContent).toContainText(poiName?.trim().split('\n')[0] || '', { timeout: 5000 });

    // Open /print and assert title text appears
    const printPagePromise = page.context().waitForEvent('page');
    const downloadButton = page.locator('button').filter({ hasText: /Download PDF/i });
    await downloadButton.click();
    
    const printPage = await printPagePromise;
    await printPage.waitForLoadState();
    
    // Assert the title appears
    await expect(printPage.locator('text=ItaloPlanner')).toBeVisible({ timeout: 5000 });
    await expect(printPage.locator('text=Your Itinerary')).toBeVisible();
    
    // Take screenshots
    await page.screenshot({ path: 'test-results/smoke-planner.png', fullPage: true });
    await printPage.screenshot({ path: 'test-results/smoke-print-page.png', fullPage: true });
    
    await printPage.close();
  });

  test('3. Add POI to Sidequests', async ({ page }) => {
    // Navigate to planner
    await page.goto('/areas/catania?date=2025-01-15');
    await waitForPlannerReady(page);

    // Find Sidequests section
    const sidequestsSection = page.locator('[class*="Sidequests"]').or(
      page.locator('text=Sidequests').locator('..').locator('..')
    ).first();
    await expect(sidequestsSection).toBeVisible();

    // Find the sidequests drop zone
    const sidequestDropZone = page.locator('[class*="drop-zone"]').or(
      sidequestsSection.locator('[class*="border-dashed"]')
    ).first();
    await expect(sidequestDropZone).toBeVisible();

    // Find second draggable POI (first might be used in previous test in same session)
    const secondPOI = page.locator('[draggable="true"]').nth(1);
    await expect(secondPOI).toBeVisible();
    
    // Get POI name
    const poiName = await secondPOI.textContent();
    expect(poiName).toBeTruthy();

    // Drag to sidequests
    await secondPOI.dragTo(sidequestDropZone, {
      sourcePosition: { x: 10, y: 10 },
      targetPosition: { x: 50, y: 50 }
    });

    // Wait for time picker modal to appear
    const timePicker = page.locator('text=Set Time for Sidequest').or(
      page.locator('input[type="time"]').locator('..')
    );
    await expect(timePicker).toBeVisible({ timeout: 5000 });

    // Set time to 11:30
    const timeInput = page.locator('input[type="time"]');
    await timeInput.fill('11:30');

    // Click Add button
    const addButton = page.locator('button').filter({ hasText: 'Add' });
    await addButton.click();

    // Wait for modal to close
    await expect(timePicker).not.toBeVisible({ timeout: 5000 });

    // Verify sidequest appears in the list
    await expect(sidequestsSection).toContainText('11:30', { timeout: 5000 });
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/sidequest-added.png', fullPage: true });
  });

  test('4. PDF Generation', async ({ page }) => {
    // Navigate to planner
    await page.goto('/areas/catania?date=2025-01-15');
    await waitForPlannerReady(page);

    // Add a POI to make the plan non-empty (PDF generation requires at least one item)
    const firstPOI = page.locator('[draggable="true"]').first();
    const slot0900 = page.locator('[class*="DroppableSlot"]').filter({ hasText: '09:00' }).first();
    
    if (await firstPOI.isVisible() && await slot0900.isVisible()) {
      await firstPOI.dragTo(slot0900);
      await page.waitForTimeout(1000);
    }

    // Setup download listener before clicking
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

    // Find and click Download PDF button
    const downloadButton = page.locator('button').filter({ hasText: /Download PDF|Generating/i });
    await expect(downloadButton).toBeVisible();
    await downloadButton.click();

    // Wait for download to start
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toMatch(/ItaloPlanner.*\.pdf$/i);

    // Save download to verify it exists
    const downloadPath = path.join('test-results', 'generated-itinerary.pdf');
    await download.saveAs(downloadPath);

    // Read the PDF content to verify it contains expected text
    const fs = require('fs');
    const pdfContent = fs.readFileSync(downloadPath);
    
    // Verify file exists and has content
    expect(pdfContent.length).toBeGreaterThan(1000); // PDF should be reasonably sized
    
    // Convert buffer to string to check for text (basic check)
    const pdfString = pdfContent.toString('binary');
    expect(pdfString).toContain('ItaloPlanner'); // Title should be in PDF
    
    // Take screenshot of the page after PDF generation
    await page.screenshot({ path: 'test-results/after-pdf-generation.png', fullPage: true });
  });

  test('5. Full workflow: Layout + Drag + Sidequest + PDF', async ({ page }) => {
    // This test combines all steps to ensure they work together
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/areas/catania?date=2025-01-15');
    await waitForPlannerReady(page);

    // 1. Verify layout
    const dayPlanner = page.locator('text=Day Planner').first();
    const poiList = page.locator('[draggable="true"]').first();
    await expect(dayPlanner).toBeVisible();
    await expect(poiList).toBeVisible();

    // 2. Drag POI to slot
    const firstPOI = page.locator('[draggable="true"]').first();
    const slot0900 = page.locator('[class*="DroppableSlot"]').filter({ hasText: '09:00' }).first();
    await firstPOI.dragTo(slot0900);
    await page.waitForTimeout(1000);

    // 3. Add to sidequests
    const secondPOI = page.locator('[draggable="true"]').nth(1);
    const sidequestZone = page.locator('[class*="drop-zone"]').first();
    if (await secondPOI.isVisible() && await sidequestZone.isVisible()) {
      await secondPOI.dragTo(sidequestZone);
      const timeInput = page.locator('input[type="time"]');
      await expect(timeInput).toBeVisible({ timeout: 5000 });
      await timeInput.fill('14:30');
      await page.locator('button').filter({ hasText: 'Add' }).click();
      await page.waitForTimeout(1000);
    }

    // 4. Generate PDF
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    const downloadButton = page.locator('button').filter({ hasText: /Download PDF/i });
    await downloadButton.click();
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);

    // Final screenshot
    await page.screenshot({ path: 'test-results/full-workflow-complete.png', fullPage: true });
  });
});
