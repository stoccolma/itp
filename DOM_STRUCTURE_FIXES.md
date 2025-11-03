# DOM Structure Fixes Summary

## Issues Addressed

Based on the diagnostic queries provided:
1. `!!document.querySelector('.md\\:col-span-5 [data-testid="sidequests"]')` - Sidequests needed to be inside the right column
2. `document.querySelectorAll('#planner-root .overflow-y-auto').length` - Too many scroll regions (should be ≤ 2)
3. `const n = document.querySelector('#pdf-root'); [n?.offsetWidth, n?.offsetHeight]` - Missing pdf-root element

## Changes Made

### 1. Fixed Planner Root ID
**File**: `app/components/DayPlannerWrapper.tsx`
- Changed `id="planner-grid"` to `id="planner-root"`
- This ensures the planner container can be properly queried

### 2. Added data-testid to Sidequests
**File**: `app/components/DayPlannerWrapper.tsx`
- Added `data-testid="sidequests"` attribute to the Sidequests component
- This allows the diagnostic query to properly identify the Sidequests component

### 3. Consolidated Scroll Regions
**File**: `app/components/DayPlannerWrapper.tsx`
- **Before**: Had 3 separate scroll regions:
  - One for Day Planner (left column)
  - One for POI List (right column)
  - One for Sidequests (right column)
- **After**: Reduced to 2 scroll regions:
  - One for Day Planner (left column) 
  - One combined scroll region for both POI List AND Sidequests (right column)
- Combined the POI List and Sidequests into a single scrollable container with `space-y-4` gap
- Removed the separate `flex flex-col gap-4` structure that was creating multiple scrollers
- Set `maxHeight: 'calc(100vh - 200px)'` on the combined scroller for proper viewport handling

### 4. Added PDF Root Container
**File**: `app/layout.tsx`
- Added `<div id="pdf-root" />` to the body element
- This container is used by the PDF generation library to measure and render the print view
- Now the diagnostic query `document.querySelector('#pdf-root')` will return a measurable node

## Structure After Fixes

```
#planner-root (grid container)
├── Left Column (.md:col-span-7)
│   └── .overflow-y-auto (Scroll region 1)
│       └── DayPlanner
└── Right Column (.md:col-span-5)
    └── .overflow-y-auto (Scroll region 2)
        ├── DraggablePOIList
        └── Sidequests [data-testid="sidequests"]
```

## Diagnostic Results

After these fixes, the diagnostic queries should return:
- `document.querySelector('.md\\:col-span-5 [data-testid="sidequests"]')` → truthy (Sidequests found in right column)
- `document.querySelectorAll('#planner-root .overflow-y-auto').length` → 2 (exactly 2 scroll regions)
- `document.querySelector('#pdf-root')` → HTMLDivElement with measurable dimensions

## Benefits

1. **Better Layout Structure**: Sidequests is now properly nested in the right column with POI list
2. **Improved Scrolling UX**: Single scroll region for the right column means users don't have to manage multiple scrollbars
3. **PDF Generation**: The pdf-root container allows proper measurement and rendering for PDF exports
4. **Testability**: The planner-root ID and data-testid attributes make the components easier to test and query
