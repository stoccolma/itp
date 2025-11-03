# Guards - Regression Detection

## Summary
Implemented dev console checks and comprehensive smoke tests to catch regressions quickly.

## 1. Dev Console Checks ✅

**Location:** `app/components/DayPlannerWrapper.tsx`

### Guard 1: Sidequests Placement
```typescript
// Check if Sidequests is inside right column
const sidequestsEl = document.querySelector('[data-testid="sidequests"]');
const insideRightCol = !!document.querySelector('.md\\:col-span-5 [data-testid="sidequests"]');

if (sidequestsEl && !insideRightCol) {
  console.error('❌ REGRESSION: Sidequests is NOT inside the right column!');
}
```

### Guard 2: Sidequests Overflow
```typescript
// Check for overflow-y-auto on Sidequests itself
if (sidequestsEl) {
  const computedStyle = getComputedStyle(sidequestsEl);
  if (computedStyle.overflowY !== 'visible') {
    console.warn('⚠️ Sidequests should not scroll - it has overflowY:', computedStyle.overflowY);
  }
}
```

### Guard 3: Scroller Count
```typescript
// Warn if more than two .overflow-y-auto in planner section
const plannerSection = document.querySelector('#planner-root');
if (plannerSection) {
  const scrollers = plannerSection.querySelectorAll('.overflow-y-auto');
  if (scrollers.length > 2) {
    console.warn(`⚠️ Found ${scrollers.length} scrollers (expected exactly 2):`, scrollers);
  }
}
```

### Debug Summary
```typescript
console.debug('DEV GUARDS CHECK', {
  sidequestsInsideRightCol: insideRightCol,
  totalScrollers: document.querySelectorAll('.overflow-y-auto').length,
  plannerScrollers: plannerSection?.querySelectorAll('.overflow-y-auto').length,
  sidequestsOverflow: sidequestsEl ? getComputedStyle(sidequestsEl).overflowY : 'N/A'
});
```

## 2. Smoke Test (Playwright) ✅

**Location:** `tests/planner-smoke.spec.ts`

### Test: Comprehensive Smoke
```typescript
test('2. Comprehensive smoke: Featured city + Two columns + Drag to slot-09:00 + Print', async ({ page }) => {
  // 1. Load home with featured city & date
  await page.goto('/?from=palermo&date=2025-10-30');
  await waitForPlannerReady(page);

  // 2. Assert: Two columns visible at 1280×720
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

  // 3. Drag first POI to 'slot-09:00'
  const firstPOI = page.locator('[draggable="true"]').first();
  const slot0900 = page.locator('[id^="slot-"]').filter({ hasText: '09:00' }).first();
  
  await firstPOI.dragTo(slot0900, {
    sourcePosition: { x: 10, y: 10 },
    targetPosition: { x: 50, y: 50 }
  });
  
  await page.waitForTimeout(1000);
  
  // 4. Assert it renders in the slot
  const slotContent = slot0900.locator('h3, h4').first();
  await expect(slotContent).toContainText(poiName?.trim().split('\n')[0] || '', { timeout: 5000 });

  // 5. Open /print and assert title text appears
  const printPagePromise = page.context().waitForEvent('page');
  const downloadButton = page.locator('button').filter({ hasText: /Download PDF/i });
  await downloadButton.click();
  
  const printPage = await printPagePromise;
  await printPage.waitForLoadState();
  
  // 6. Assert the title appears
  await expect(printPage.locator('text=ItaloPlanner')).toBeVisible({ timeout: 5000 });
  await expect(printPage.locator('text=Your Itinerary')).toBeVisible();
  
  // Take screenshots
  await page.screenshot({ path: 'test-results/smoke-planner.png', fullPage: true });
  await printPage.screenshot({ path: 'test-results/smoke-print-page.png', fullPage: true });
  
  await printPage.close();
});
```

## Expected Console Output (Dev Mode)

### Clean Run (No Regressions):
```
DEV GUARDS CHECK {
  sidequestsInsideRightCol: true,
  totalScrollers: 2,
  plannerScrollers: 2,
  sidequestsOverflow: 'visible'
}
```

### With Regressions:
```
❌ REGRESSION: Sidequests is NOT inside the right column!

⚠️ Sidequests should not scroll - it has overflowY: auto

⚠️ Found 4 scrollers (expected exactly 2): NodeList [...]
```

## Running Tests

```bash
# Run smoke tests
pnpm test:e2e

# Run specific test
npx playwright test --grep "Comprehensive smoke"

# Run with UI
npx playwright test --ui
```

## Test Coverage

The comprehensive smoke test verifies:

1. ✅ **Featured city loading** - Uses `/?from=palermo&date=2025-10-30`
2. ✅ **Layout at 1280×720** - Both columns visible and within viewport
3. ✅ **Drag and drop** - First POI to `slot-09:00`
4. ✅ **POI renders** - Confirms POI name appears in slot
5. ✅ **Print page** - Opens `/print` in new tab
6. ✅ **Print content** - Verifies "ItaloPlanner" and "Your Itinerary" text
7. ✅ **Screenshots** - Captures both planner and print page

## Acceptance Criteria Met

✅ **Dev warnings are clean** when no regressions
✅ **Console errors** alert immediately if Sidequests misplaced
✅ **Console warnings** if too many scrollers detected
✅ **Smoke test** verifies entire flow in one test
✅ **Screenshots** captured for visual verification

## Files Modified

- `app/components/DayPlannerWrapper.tsx` - Enhanced dev guards
- `tests/planner-smoke.spec.ts` - Comprehensive smoke test

## Next Steps

To run the guards:

1. **Development:**
   ```bash
   pnpm dev
   # Open /?from=palermo&date=2025-10-30
   # Check console for "DEV GUARDS CHECK"
   ```

2. **Testing:**
   ```bash
   pnpm test:e2e
   # Review test-results/ for screenshots
   ```

3. **Verify Clean:**
   - No ❌ errors in console
   - No ⚠️ warnings about scrollers
   - All smoke tests pass

**Status: IMPLEMENTED ✅**
