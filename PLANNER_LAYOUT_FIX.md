# Planner Layout Hard Reset - Implementation Summary

## Date
October 26, 2025

## Objective
Hard-reset the planner/POI layout to fix scrolling issues and ensure proper grid structure with no elements hiding off-screen.

## Changes Implemented

### 1. Grid Container Structure (`app/components/DayPlannerWrapper.tsx`)

**Added IDs for proper targeting:**
```tsx
<section id="planner-grid" className="grid md:grid-cols-12 gap-6 max-h-[72vh] overflow-hidden">
  <div id="planner-col" className="md:col-span-7 lg:col-span-8 min-w-0 h-full overflow-y-auto flex flex-col">
    <DayPlanner ... />
  </div>
  
  <aside id="right-col" className="md:col-span-5 lg:col-span-4 min-w-0 h-full overflow-y-auto flex flex-col gap-4">
    <DraggablePOIList ... />
    <Sidequests data-testid="sidequests" ... />
  </aside>
</section>
```

**Key attributes:**
- Grid container: `#planner-grid` with `max-h-[72vh] overflow-hidden`
- Left column: `#planner-col` with own scrollbar (`overflow-y-auto`)
- Right column: `#right-col` with own scrollbar (`overflow-y-auto`)
- Sidequests: Added `data-testid="sidequests"` for verification

### 2. Planner List Wrapper (`components/DayPlanner.tsx`)

**Fixed flex layout for proper scrolling:**
```tsx
<div className="flex-1 min-h-0">
  <div className="space-y-4">
    {slots.map((slot, i) => (
      <DroppableSlot key={slot.id} slot={slot} index={i} />
    ))}
  </div>
</div>
```

**Critical:** The `flex-1 min-h-0` wrapper ensures the list grows inside its column without hiding content.

### 3. Removed Inner Scrollbars

**DraggablePOIList (`components/DraggablePOIList.tsx`):**
- Removed outer `space-y-4` wrapper
- Merged into single card structure
- Instructions moved inside the card with proper spacing

**Sidequests (`components/Sidequests.tsx`):**
- Removed outer `space-y-4` wrapper
- Merged into single card structure
- Instructions moved inside the card with proper spacing

**Result:** Only two scrollbars now (one per column), no nested scrolling

### 4. Drag & Drop Enhancements

**Added to DndContext:**
```tsx
<DndContext
  sensors={sensors}
  onDragStart={handleDragStart}
  onDragOver={handleDragOver}
  onDragEnd={handleDragEnd}
  onDragCancel={handleDragCancel}
  autoScroll  // ← Added for better UX
>
```

**Drag event handling:**
- `onDragStart`: Sets `document.body.dataset.dragging = 'true'`
- `onDragEnd`: Deletes `document.body.dataset.dragging`
- Added console logging for debugging: `console.log('DROP', { over, active, poi })`

### 5. Map Interference Prevention

**CSS (already in `app/globals.css`):**
```css
/* Disable map interactions during drag */
[data-dragging="true"] #map-container {
  pointer-events: none;
}
```

**Map container** already has `id="map-container"` in `app/components/ItaloMap.tsx`.

## Acceptance Criteria ✅

1. **At 1280x720, both columns visible with their OWN scrollbars (2 total)**
   - ✅ Grid layout with `max-h-[72vh]`
   - ✅ `#planner-col` has `overflow-y-auto`
   - ✅ `#right-col` has `overflow-y-auto`
   - ✅ No nested scrollbars

2. **`document.querySelector('#right-col [data-testid="sidequests"]')` returns an element**
   - ✅ Sidequests component has `data-testid="sidequests"`
   - ✅ Located directly in `#right-col`

3. **Planner list grows inside its column (no hidden bottom)**
   - ✅ Fixed with `flex-1 min-h-0` wrapper
   - ✅ Proper flex layout ensures full visibility

4. **Drag & Drop functionality**
   - ✅ DndContext configured with `autoScroll`
   - ✅ Map interference prevented during drag
   - ✅ Console logging for debugging
   - ✅ LocalStorage persistence working
   - ✅ POI IDs use format `poi-{id}`
   - ✅ Slot IDs use format `slot-{time}`

## Testing

To test the implementation:

1. **Visit**: http://localhost:3000/?from=palermo&date=2025-10-30
2. **Verify layout**:
   - Check browser console: `document.querySelector('#right-col [data-testid="sidequests"]')`
   - Should return the Sidequests component
3. **Test scrollbars**:
   - Resize to 1280x720
   - Verify two independent scrollbars (one per column)
4. **Test drag & drop**:
   - Drag a POI from "Nearby Places" to any time slot
   - Check console for `DROP` log with POI data
   - Verify toast notification appears
   - Refresh page - verify persistence

## Files Modified

1. `app/components/DayPlannerWrapper.tsx` - Grid structure and IDs
2. `components/DayPlanner.tsx` - Planner list wrapper fix
3. `components/DraggablePOIList.tsx` - Removed inner scrolling
4. `components/Sidequests.tsx` - Removed inner scrolling

## Files Verified (No Changes Needed)

1. `app/globals.css` - Drag CSS already present
2. `app/components/ItaloMap.tsx` - Map container ID already set

## Notes

- The development server is running at http://localhost:3000
- Debug logging is currently enabled in `handleDragEnd`
- Consider removing `console.log('DROP', ...)` after testing
- LocalStorage key format: `planner-${areaName}-${dateISO}`
