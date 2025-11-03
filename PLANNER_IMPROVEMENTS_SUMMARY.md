# Planner Improvements Summary

## Overview
Comprehensive improvements to the Sicily day planner including date selection, map zoom, contextual distances, editable times, and Tucci-style destination intros.

## Changes Implemented

### 1. Date Selector Fix ✅
**File:** `components/OneLinePlanner.tsx`
- Restored full interactive date picker
- Entire field is now clickable (not just icon)
- Calendar opens properly with showPicker()
- Manual input supported (YYYY-MM-DD format)
- Default visual value shows today, but only commits when user selects
- Keyboard accessibility added (Enter/Space to open picker)

### 2. Map Zoom + POI Display ✅
**File:** `app/components/ItaloMap.tsx`
- Added automatic city zoom using `fitBounds(CITY_BBOX[city], { padding: 48 })`
- Zoom triggers when city is selected from URL params (no auto-scroll)
- POI color differentiation:
  - Main plan POIs: `#43b3ae` (teal accent)
  - Sidequests: `#ff9966` (orange accent)
- Map zooms smoothly to selected city bounds on selection
- Uses existing CITY_BBOX from planStore.ts

### 3. Distance / Walk Time Logic ✅
**New File:** `lib/distance.ts`
- Contextual distance calculation based on:
  - Planner mode: from previous POI → next POI
  - No plan yet: from city center
  - Sidequests: from nearest main stop
- Walk time conversion: meters / 80 (4.8 km/h standard)
- Natural labeling with clamping:
  - < 5 min = "2-3 min walk"
  - > 25 min = "Transit advised"
  - Normal: "X min walk from [location]"
- Helper functions for formatting distances and times

### 4. Planner Time / Edit Controls ✅
**File:** `components/DayPlanner.tsx`
- Added editable time fields:
  - Click time to edit manually
  - Type input with time picker
  - Enter to save, Escape to cancel
- Reordering controls:
  - Up/Down arrows to reorder stops
  - Visual feedback for first/last items (disabled arrows)
- Remove button (X icon) to clear POI from slot
- All changes persist in component state
- Smooth transitions and hover states

### 5. Destination Intro Content ✅
**New Files:**
- `data/cities.json` - Tucci-style intros for all 6 cities
- `lib/cities.ts` - Helper functions to load city data

**Updated Files:**
- `app/components/DestinationStory.tsx` - Uses city intros instead of generic text
- `app/page.tsx` - Loads and passes city intro data

**City Intros:**
- Palermo: "Sun, noise, and history in the same breath..."
- Agrigento: "Temples of stone above the orchards..."
- Noto: "Honey-colored baroque dream..."
- Siracusa: "Marble and sea arguing about who came first..."
- Catania: "Smoke from Etna curling into the espresso air..."
- Taormina: "Terraces of light, theater perched on the edge of myth..."

Removed generic "View on map ↑" button and placeholder copy.

### 6. Sidequests Improvements ✅
**File:** `components/SidequestsList.tsx`
- Added MapPin icon for visual consistency
- Improved distance formatting with walk time clamping
- Added type badge display (if available)
- Maintained existing up/down reordering and delete functionality

### 7. AI Bubble Consistency ✅
**File:** `app/components/HelpAgent.tsx`
- Existing implementation already has proper timing logic
- Appears as floating button in bottom-right
- No changes needed - already follows requirements

## Build Status
✅ Build successful with no errors
✅ All TypeScript types valid
✅ No linting issues
✅ 18 pages generated successfully

## Critical Bug Fixes Applied

### Date Picker Navigation Fix
**Issue:** Date picker worked but "Plan Day" button only scrolled, didn't trigger map zoom.
**Fix:** Modified `handlePlanDay` in `OneLinePlanner.tsx` to use `router.push()` with URL params, which triggers the map zoom effect.

### Map Zoom Timing Fix
**Issue:** `fitBounds` might fire before map is fully loaded.
**Fix:** Added proper load state checking with `map.loaded()` and fallback to `map.once('load')` event. Added console logging for debugging.

**Key Changes:**
```typescript
// In OneLinePlanner.tsx
router.push(`/?from=${city}&date=${dateToUse}`, { scroll: false });

// In ItaloMap.tsx
if (mapRef.current && mapRef.current.loaded()) {
  setTimeout(performZoom, 100);
} else if (mapRef.current) {
  mapRef.current.once('load', () => {
    setTimeout(performZoom, 100);
  });
}
```

## Files Created
1. `data/cities.json` - City intro content
2. `lib/cities.ts` - City data helper functions
3. `lib/distance.ts` - Distance calculation utilities
4. `PLANNER_IMPROVEMENTS_SUMMARY.md` - This file

## Files Modified
1. `components/OneLinePlanner.tsx` - Date picker improvements
2. `app/components/ItaloMap.tsx` - City zoom with fitBounds
3. `components/DayPlanner.tsx` - Editable times and reordering
4. `components/SidequestsList.tsx` - Improved formatting
5. `app/components/DestinationStory.tsx` - Tucci-style intros
6. `app/page.tsx` - Load and pass city intro data

## Testing Recommendations

### Quick Test Flow:
1. Run `npm run dev` or `pnpm dev`
2. Open http://localhost:3000
3. Select a city (e.g., Palermo)
4. Click date field - calendar should open
5. Select a date
6. Click "Plan Day"
7. **Watch for:**
   - Console log: "🗺️ Zooming to city: palermo bbox: [...]"
   - Map should zoom to the city bounds
   - Planner should appear with generated stops
   - Tucci-style intro should display for the city

### Detailed Testing:
1. **Date Picker:**
   - Click anywhere on date field (not just icon)
   - Calendar opens properly
   - Select different dates - changes should persist
   - Manual keyboard input works (YYYY-MM-DD)

2. **Map Zoom:**
   - Test all 6 cities: Palermo, Catania, Taormina, Siracusa, Noto, Agrigento
   - Each should zoom to correct bounds
   - No auto-scroll to map element (stays in view)
   - Check browser console for zoom confirmation logs

3. **POI Colors:**
   - Zoom in to see POIs (zoom level >= 11)
   - Main plan POIs should be teal (#43b3ae)
   - Sidequest POIs should be orange (#ff9966)

4. **Editable Times:**
   - Click time on any plan stop
   - Time input should appear
   - Press Enter to save, Escape to cancel
   - Time should update

5. **Reordering:**
   - Click up/down arrows on plan stops
   - Stops should reorder
   - First item's up arrow should be disabled
   - Last item's down arrow should be disabled

6. **Tucci Intros:**
   - Verify each city shows unique intro text
   - No generic "View on map" button
   - Text should be evocative and city-specific

## Known Limitations
- Hover sync between planner and map markers (optional) - not implemented
- Map legend (optional) - not implemented
- POI popup with "Add as Sidequest" - not implemented (future enhancement)

## Next Steps
If needed:
1. Add POI click popups with compact cards
2. Implement hover sync between planner rows and map markers
3. Add subtle map legend for POI colors
4. Consider drag-and-drop reordering (currently using arrows)
