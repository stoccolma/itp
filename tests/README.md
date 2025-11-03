# Planner Smoke Tests

Comprehensive end-to-end tests for the ItaloPlanner application using Playwright.

## Test Coverage

### 1. Layout Test
- Navigates to `/areas/catania?date=2025-01-15`
- Verifies viewport is 1280x720
- Checks that both Day Planner and POI List columns are visible
- Validates both columns fit within viewport width
- **Screenshot**: `test-results/planner-layout.png`

### 2. Drag POI to Slot Test
- Drags first POI from the list
- Drops it into the 09:00 time slot
- Verifies POI name appears in the slot
- **Screenshot**: `test-results/poi-in-slot.png`

### 3. Add POI to Sidequests Test
- Drags second POI to Sidequests drop zone
- Sets time to 11:30 in the time picker modal
- Confirms sidequest is added and displays correct time
- **Screenshot**: `test-results/sidequest-added.png`

### 4. PDF Generation Test
- Adds a POI to create non-empty plan
- Clicks "Download PDF" button
- Waits for PDF download
- Verifies:
  - PDF filename matches pattern `ItaloPlanner*.pdf`
  - PDF file size > 1KB
  - PDF contains "ItaloPlanner" text
- **Saved PDF**: `test-results/generated-itinerary.pdf`
- **Screenshot**: `test-results/after-pdf-generation.png`

### 5. Full Workflow Test
- Combines all above steps in sequence
- Ensures features work together correctly
- **Screenshot**: `test-results/full-workflow-complete.png`

## Running Tests

### Run all planner smoke tests:
```bash
npm run test:planner
```

### Run specific test:
```bash
npx playwright test tests/planner-smoke.spec.ts -g "Layout"
```

### Run with UI mode (interactive):
```bash
npx playwright test tests/planner-smoke.spec.ts --ui
```

### Run in headed mode (see browser):
```bash
npx playwright test tests/planner-smoke.spec.ts --headed
```

### Debug mode:
```bash
npx playwright test tests/planner-smoke.spec.ts --debug
```

## Test Results

Results are saved to:
- **Screenshots**: `test-results/*.png` (on failure, automatically captured)
- **Videos**: `test-results/*.webm` (on failure)
- **PDF**: `test-results/generated-itinerary.pdf`
- **HTML Report**: `playwright-report/index.html`

To view the HTML report:
```bash
npx playwright show-report
```

## Configuration

Tests are configured in `playwright.config.ts`:
- **Base URL**: `http://localhost:3000`
- **Viewport**: 1280x720 (set per test)
- **Screenshots**: Captured on failure
- **Videos**: Retained on failure
- **Traces**: Captured on first retry

The dev server is automatically started before tests run if not already running.

## Requirements

- Node.js 18+ 
- npm dependencies installed
- POI data must exist for Catania area
- Port 3000 must be available

## Troubleshooting

### Tests fail to start
- Ensure dev server can start: `npm run dev`
- Check port 3000 is available
- Verify POI data exists: `data/pois.csv`

### Drag and drop fails
- Tests wait 1 second after page load for hydration
- If still failing, increase timeout in `waitForPlannerReady()`

### PDF generation fails
- Ensure at least one POI is in the plan
- Check browser has permission to download files
- Verify html2pdf.js is installed

### Screenshots not captured
- Check `test-results/` directory exists and is writable
- Ensure screenshot config in `playwright.config.ts` is correct

## CI/CD Integration

For CI environments, tests will:
- Retry failed tests up to 2 times
- Run with 1 worker (sequential)
- Always capture traces and screenshots on failure

Example GitHub Actions:
```yaml
- name: Install dependencies
  run: npm ci
  
- name: Install Playwright browsers
  run: npx playwright install --with-deps chromium
  
- name: Run planner smoke tests
  run: npm run test:planner
  
- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-results
    path: test-results/
```

## Adding New Tests

To add new test cases:

1. Add to `tests/planner-smoke.spec.ts`
2. Use the `waitForPlannerReady()` helper
3. Follow the naming convention: `X. Description`
4. Include screenshot capture
5. Document in this README

Example:
```typescript
test('6. New feature test', async ({ page }) => {
  await page.goto('/areas/catania?date=2025-01-15');
  await waitForPlannerReady(page);
  
  // Test logic here
  
  await page.screenshot({ 
    path: 'test-results/new-feature.png' 
  });
});
