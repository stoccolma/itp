# Scroll Layout Fix Summary

## Changes Made

### 1. Grid Wrapper (app/components/DayPlannerWrapper.tsx)

**Problem:** The layout had nested wrappers and wasn't properly constraining height for scrolling columns.

**Solution:**
- Simplified structure by removing nested divs
- Applied `grid md:grid-cols-12 gap-6 max-h-[72vh] overflow-hidden` directly to the section
- Each column now has its own independent scrollbar

**Before:**
```tsx
<div className="max-h-[72vh] overflow-hidden">
  <section className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
    <div className="md:col-span-7 lg:col-span-8 min-w-0 overflow-visible">
      <div ref={plannerScrollRef} className="h-full overflow-y-auto scroll-smooth">
        <DayPlanner ... />
      </div>
    </div>
    <aside className="md:col-span-5 lg:col-span-4 min-w-0 overflow-visible">
      <div ref={poiScrollRef} className="h-full overflow-y-auto scroll-smooth space-y-6">
        <DraggablePOIList ... />
        <div ref={sidequestScrollRef}>
          <Sidequests ... />
        </div>
      </div>
    </aside>
  </section>
</div>
```

**After:**
```tsx
<section className="grid md:grid-cols-12 gap-6 max-h-[72vh] overflow-hidden">
  <div 
    ref={plannerScrollRef}
    className="md:col-span-7 lg:col-span-8 min-w-0 h-full overflow-y-auto"
  >
    <DayPlanner ... />
  </div>

  <aside 
    ref={poiScrollRef}
    className="md:col-span-5 lg:col-span-4 min-w-0 h-full overflow-y-auto space-y-6"
  >
    <DraggablePOIList ... />
    <div ref={sidequestScrollRef}>
      <Sidequests ... />
    </div>
  </aside>
</section>
```

### 2. Column Configuration

**Left Column (Planner):**
- Classes: `md:col-span-7 lg:col-span-8 min-w-0 h-full overflow-y-auto`
- Takes 7 columns on medium screens, 8 on large
- Has its own vertical scrollbar
- Contains: DayPlanner component

**Right Column (POIs & Sidequests):**
- Classes: `md:col-span-5 lg:col-span-4 min-w-0 h-full overflow-y-auto space-y-6`
- Takes 5 columns on medium screens, 4 on large  
- Has its own vertical scrollbar
- Contains: DraggablePOIList + Sidequests (stacked vertically)

### 3. Sidequests Position

**Problem:** Sidequests was rendering outside the grid.

**Solution:**
- Sidequests now renders INSIDE the right column
- It appears below the POI list
- Both scroll together in the right column
- No separate/nested scrollbar inside Sidequests

### 4. Removed Nested Scrollbar (components/Sidequests.tsx)

**Problem:** Sidequests had `max-h-[60vh] overflow-y-auto` creating a third scrollbar.

**Solution:**
- Removed `max-h-[60vh] overflow-y-auto` from the sidequests container
- Now uses parent column's scrolling instead

**Before:**
```tsx
<div className="p-3 space-y-3 max-h-[60vh] overflow-y-auto">
```

**After:**
```tsx
<div className="p-3 space-y-3">
```

### 5. Drag State Management

**Problem:** Used classList which could conflict with other classes.

**Solution:**
- Changed from `document.body.classList.add('dragging')` to `document.body.dataset.dragging = 'true'`
- Changed from `document.body.classList.remove('dragging')` to `delete document.body.dataset.dragging`

**Changes:**
- `handleDragStart`: Sets `document.body.dataset.dragging = 'true'`
- `handleDragEnd`: Deletes `document.body.dataset.dragging`
- `handleDragCancel`: Deletes `document.body.dataset.dragging`

### 6. Map Pointer Events (app/globals.css)

**Problem:** Map was using class-based selector.

**Solution:**
- Updated CSS to use data attribute selector

**Before:**
```css
.dragging #map-container {
  pointer-events: none;
}
```

**After:**
```css
[data-dragging="true"] #map-container {
  pointer-events: none;
}
```

## Acceptance Criteria ✅

1. ✅ **Grid layout:** Uses `grid md:grid-cols-12 gap-6 max-h-[72vh] overflow-hidden`
2. ✅ **Planner column:** `md:col-span-7 lg:col-span-8 min-w-0 h-full overflow-y-auto`
3. ✅ **Right column:** `md:col-span-5 lg:col-span-4 min-w-0 h-full overflow-y-auto`
4. ✅ **Sidequests position:** Renders INSIDE right column BELOW POI list
5. ✅ **No nested scrollbars:** Only the two columns scroll, no overflow inside cards
6. ✅ **Drag state:** Uses `document.body.dataset.dragging='true'`
7. ✅ **Map disabled during drag:** CSS uses `[data-dragging="true"]` selector

## Layout Behavior

### At 1280×720 (and similar resolutions):

- **Two-column layout visible** on medium+ screens
- **Left column:** Day Planner with independent scrollbar
- **Right column:** POI list + Sidequests panel with shared scrollbar
- **72vh height constraint:** Both columns constrained to 72% viewport height
- **No nested scrollbars:** Clean, single scrollbar per column
- **Sidequests expandable:** Visible in right column, expands naturally

### Drag & Drop:

- **During drag:** Map pointer events disabled via data attribute
- **No map interference:** Dragging POIs works smoothly without map intercepting
- **Clean state management:** Dataset approach avoids class conflicts

## Files Modified

1. `app/components/DayPlannerWrapper.tsx` - Simplified grid structure, updated drag state
2. `components/Sidequests.tsx` - Removed nested scrollbar
3. `app/globals.css` - Updated map pointer-events selector

## Testing Results

- ✅ Two-column layout renders correctly at 1280×720
- ✅ Both columns have their own scrollbars
- ✅ Sidequests panel visible in right column below POI list
- ✅ No third/nested scrollbar appears
- ✅ Map doesn't interfere with drag operations
- ✅ Layout responsive across screen sizes
