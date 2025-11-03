# Day Planner Fixes Summary

## Issues Fixed

### 1. Drag and Drop Not Replacing Items
**Problem**: Items dragged to slots weren't properly replacing/adding to the day planner.

**Root Cause**: 
- Unused `handleDrop` function in `DayPlanner.tsx` that wasn't connected to DnD system
- Incomplete POI data being passed (missing lat, lon, address, etc.)

**Solution**:
- Removed unused `handleDrop` from `DayPlanner.tsx`
- Updated `DayPlannerWrapper.tsx` to fetch full POI data via API when dropping
- Added `fetchPOIById()` helper function that retrieves complete POI details including:
  - lat/lon coordinates
  - address
  - category
  - tags
  - short_desc
  - timing
  - source_url

**Files Modified**:
- `components/DayPlanner.tsx` - Removed unused handleDrop and cleaned up DroppableSlot props
- `app/components/DayPlannerWrapper.tsx` - Added POI fetching logic with proper async handling

### 2. Empty PDF Issue
**Problem**: PDF generation was producing empty or incomplete PDFs.

**Root Cause**: 
- `ItineraryPrintView.tsx` was filtering out empty slots
- Missing POI data (address, coordinates) needed for links

**Solution**:
- Modified `ItineraryPrintView.tsx` to include ALL slots
- Empty slots now display time with '—' character
- Google Maps URLs now use 5 decimal precision: `lat.toFixed(5),lon.toFixed(5)`
- Full POI data now available for generating proper links

**Files Modified**:
- `components/ItineraryPrintView.tsx` - Show all slots, render '—' for empty ones

### 3. PDF Generation Error Handling
**Problem**: No user-friendly error handling when PDF generation fails.

**Solution**:
- Added try-catch in `handleDownloadPDF()`
- Shows helpful error message with two options:
  1. Use browser's print function (Ctrl/Cmd + P)
  2. Select "Save as PDF" from print dialog
- Offers to open print dialog automatically via `window.print()`

**Files Modified**:
- `components/DayPlanner.tsx` - Enhanced error handling with user-friendly fallback

### 4. Unit Tests for URL Builders
**Requirement**: Add lightweight unit tests for URL construction.

**Solution**:
- Created `lib/url-builder.spec.ts` with 13 comprehensive tests
- Tests cover:
  - POI details URLs: `/poi/{id}`
  - Google Maps URLs with 5 decimal precision
  - Edge cases: negative coords, zero coords, special characters
  - Fallback to address when coordinates unavailable
  - Empty slot rendering with '—' character

**Test Results**: ✅ All 13 tests passing

**Files Created**:
- `lib/url-builder.spec.ts` - Comprehensive URL builder tests using Playwright

**Files Modified**:
- `package.json` - Added test scripts: `test:urls` and `test`

### 5. Empty Slot Guard
**Requirement**: If a slot has no items, still print time and '—' (not empty).

**Solution**:
- `ItineraryPrintView.tsx` now checks for empty POI
- Renders table row with:
  - Time column: slot time
  - Place column: '—' (em dash)
  - Details column: slot title (e.g., "Morning", "Lunch")

**Files Modified**:
- `components/ItineraryPrintView.tsx` - Added conditional rendering for empty slots

## Testing

### URL Builder Tests
```bash
npm run test:urls
```
**Result**: ✅ 13/13 tests passing

### Test Coverage
- POI detail URL construction
- Google Maps URL with 5 decimal lat/lon precision
- Handling of edge cases (negative, zero, special characters)
- Empty slot rendering
- Fallback mechanisms

## Acceptance Criteria

✅ **Tests pass**: All 13 unit tests passing  
✅ **PDF still exports**: PDF generation working with enhanced error handling  
✅ **Drag and drop works**: Items properly added to planner with full data  
✅ **Empty slots show '—'**: Time and em dash displayed for unfilled slots  
✅ **User-friendly errors**: Helpful fallback to window.print() on PDF failure

## Files Changed

### Modified
1. `components/DayPlanner.tsx` - Removed unused code, added error handling
2. `components/ItineraryPrintView.tsx` - Show all slots, 5-decimal precision URLs
3. `app/components/DayPlannerWrapper.tsx` - Fetch full POI data on drop
4. `package.json` - Added test scripts

### Created
1. `lib/url-builder.spec.ts` - Comprehensive URL builder tests

## Usage

### Run URL Builder Tests
```bash
npm run test:urls
```

### Run All Tests
```bash
npm run test
```

### Generate PDF
1. Add places to day planner via drag and drop
2. Click "Download PDF" button
3. If PDF generation fails, system offers browser print dialog
4. PDF includes all slots (filled and empty with '—')
5. Links use 5-decimal precision for coordinates
