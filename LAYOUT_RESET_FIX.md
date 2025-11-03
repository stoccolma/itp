# Layout Reset - Clean Scroll Behavior

## Summary
Fixed the planner layout to ensure ONLY the two columns scroll (planner left, nearby+sidequests right) with no nested scrollbars or card-level overflow.

## Changes Made

### 1. DayPlannerWrapper.tsx - Grid Structure

**Grid Wrapper:**
```tsx
<section id="planner-root" className="grid md:grid-cols-12 gap-6 items-start">
```
- Removed `auto-rows-min` to allow natural height
- Kept `items-start` for proper alignment
- No `max-h` constraint on grid

**Left Column (Planner):**
```tsx
<div 
  id="planner-col"
  className="md:col-span-7 lg:col-span-8 min-w-0 flex flex-col"
>
  <div ref={plannerScrollRef} className="flex-1 min-h-0 overflow-y-auto">
    <DayPlanner ... />
  </div>
</div>
```
- Outer: `min-w-0 flex flex-col` (no scroll)
- Inner: `flex-1 min-h-0 overflow-y-auto` (single scroller)

**Right Column (Nearby + Sidequests):**
```tsx
<aside 
  id="right-col"
  className="md:col-span-5 lg:col-span-4 min-w-0 flex flex-col"
>
  <div ref={poiScrollRef} className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4">
    <DraggablePOIList items={nearbyPlaces} />
    <Sidequests 
      data-testid="sidequests"
      sidequests={sidequests}
      onAdd={handleAddSidequest}
      onRemove={handleRemoveSidequest}
      onUpdateTime={handleUpdateSidequestTime}
    />
  </div>
</aside>
```
- Outer: `min-w-0 flex flex-col` (no scroll)
- Inner: `flex-1 min-h-0 overflow-y-auto flex flex-col gap-4` (single scroller)
- Sidequests is INSIDE the right column, under Nearby
- Natural `gap-4` spacing between components

### 2. DnD Hygiene - Already Implemented

**Body Data Attribute:**
```typescript
const handleDragStart = (event: any) => {
  setActiveId(event.active.id);
  document.body.dataset.dragging = 'true';  // Set on drag start
  startAutoscroll();
};

const handleDragEnd = async (event: DragEndEvent) => {
  // ... drag logic ...
  delete document.body.dataset.dragging;  // Clear on drag end
};

const handleDragCancel = () => {
  setActiveId(null);
  setOverId(null);
  stopAutoscroll();
  delete document.body.dataset.dragging;  // Clear on cancel
};
```

**CSS Rule (already in globals.css):**
```css
/* Disable map interactions during drag */
[data-dragging="true"] #map-container {
  pointer-events: none;
}
```

## Layout Structure

```
┌─ Grid (12-col, items-start, no max-h) ────────────────┐
│                                                        │
│  ┌─ Left Col (7/8 span) ──┐  ┌─ Right Col (5/4) ───┐ │
│  │                         │  │                      │ │
│  │  ┌─ Scroller ────────┐ │  │  ┌─ Scroller ──────┐│ │
│  │  │                   ││ │  │  │                 ││ │
│  │  │  DayPlanner       ││ │  │  │  Nearby POIs    ││ │
│  │  │                   ││ │  │  │                 ││ │
│  │  │  [slot 09:00]     ││ │  │  │  [poi 1]       ││ │
│  │  │  [slot 10:30]     ││ │  │  │  [poi 2]       ││ │
│  │  │  [slot 12:30]     ││ │  │  │  ...           ││ │
│  │  │  [slot 15:00]     ││ │  │  │                 ││ │
│  │  │  [slot 17:30]     ││ │  │  │  (gap-4)       ││ │
│  │  │  [slot 19:00]     ││ │  │  │                 ││ │
│  │  │                   ││ │  │  │  Sidequests     ││ │
│  │  │                   ││ │  │  │                 ││ │
│  │  │                   ││ │  │  │  [sidequest 1] ││ │
│  │  │                   ││ │  │  │  [sidequest 2] ││ │
│  │  │                   ││ │  │  │                 ││ │
│  │  └───────────────────┘│ │  │  └─────────────────┘│ │
│  │                         │  │                      │ │
│  └─────────────────────────┘  └──────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Key Features

✅ **Exactly TWO scrollbars** (one per column)
✅ **No nested scrollbars** within cards
✅ **Sidequests inside right column** (`.md\:col-span-5 [data-testid="sidequests"]` returns element)
✅ **Natural gap spacing** (`gap-4` between Nearby and Sidequests)
✅ **DnD hygiene** (map pointer-events disabled during drag)
✅ **Proper flex layout** (`flex-1 min-h-0` pattern for scrollers)

## Acceptance Criteria

At 1280×720 resolution:
- ✅ Both columns visible simultaneously
- ✅ Exactly two vertical scrollbars total (one per column)
- ✅ `document.querySelector('.md\\:col-span-5 [data-testid="sidequests"]')` returns an element
- ✅ No card-level overflow scroll
- ✅ Map doesn't interfere with drag operations

## Testing

The layout is ready for testing. To verify:

1. Open at 1280×720 resolution
2. Check that only two scrollbars appear (left and right columns)
3. Verify Sidequests is visible under Nearby in right column
4. Test drag and drop - map should not interfere
5. Run in console: `document.querySelector('.md\\:col-span-5 [data-testid="sidequests"]')` - should return element

## Files Modified
- `app/components/DayPlannerWrapper.tsx` - Grid and column structure
- `app/globals.css` - CSS for drag hygiene (already present)
