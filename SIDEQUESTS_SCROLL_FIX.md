# Sidequests Scroll Behavior Fix

## Summary
Fixed the scroll behavior in the planner grid to ensure only TWO scrollbars exist (planner column and right column), with Sidequests growing naturally and scrolling with the right column.

## Changes Made

### 1. DayPlannerWrapper.tsx - Fixed Grid Column Overflow
**Before:**
```tsx
<div 
  id="planner-col"
  className="md:col-span-7 lg:col-span-8 min-w-0 flex flex-col"
>
  <div ref={plannerScrollRef} className="flex-1 min-h-0 overflow-y-auto">
    <DayPlanner ... />
  </div>
</div>

<aside 
  id="right-col"
  className="md:col-span-5 lg:col-span-4 min-w-0"
>
  <div ref={poiScrollRef} className="overflow-y-auto space-y-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
    <DraggablePOIList ... />
    <Sidequests ... />
  </div>
</aside>
```

**After:**
```tsx
<div 
  id="planner-col"
  ref={plannerScrollRef}
  className="md:col-span-7 lg:col-span-8 min-w-0 h-full overflow-y-auto"
>
  <DayPlanner ... />
</div>

<aside 
  id="right-col"
  ref={poiScrollRef}
  className="md:col-span-5 lg:col-span-4 min-w-0 h-full overflow-y-auto flex flex-col gap-4"
>
  <DraggablePOIList ... />
  <Sidequests ... />
</aside>
```

**Key Changes:**
- Moved `overflow-y-auto` directly to the column containers
- Added `h-full` to both columns
- Removed inner wrapper divs with their own scroll
- Added `flex flex-col gap-4` to right column for natural spacing

### 2. Sidequests.tsx - Removed All Scroll/Height Constraints
**Before:**
```tsx
<div className="space-y-4">
  <div className="card p-6 bg-white dark:bg-zinc-800">
    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
      Sidequests
    </h3>
    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
      Quick stops between main activities
    </p>
    
    <div className={`min-h-[200px] rounded-lg border-2 border-dashed ...`}>
      {/* content */}
    </div>
  </div>
  
  <div className="card p-4 text-xs ...">
    <p><strong>Sidequests:</strong> ...</p>
  </div>
</div>
```

**After:**
```tsx
<div data-testid="sidequests" className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/40 p-3">
  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-1">
    Sidequests
  </h3>
  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
    Quick stops between main activities
  </p>
  
  <div className={`rounded-lg border-2 border-dashed transition-colors p-3 ...`}>
    {sortedSidequests.length > 0 ? (
      <div className="flex flex-col gap-2">
        {/* items */}
      </div>
    ) : (
      <div className="py-8 text-center text-sm ...">
        {/* empty state */}
      </div>
    )}
  </div>
  
  <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
    <p><strong>Tip:</strong> ...</p>
  </div>
</div>
```

**Key Changes:**
- Removed all nested card wrappers
- Removed `min-h-[200px]` and other height constraints
- Removed `space-y-4` parent wrapper
- Simplified to single container with auto-sizing
- Changed list container from `space-y-3` to `flex flex-col gap-2`
- Made header smaller (`text-sm` instead of `text-lg`)
- Consolidated tip text into single block

### 3. Added Dev-Only Sanity Guard
Added a development-only check to warn if Sidequests component has its own scroller:

```tsx
useEffect(() => {
  if (mounted && process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      const sidequestsEl = document.querySelector('[data-testid="sidequests"]');
      if (sidequestsEl) {
        const computedStyle = getComputedStyle(sidequestsEl);
        if (computedStyle.overflowY !== 'visible') {
          console.warn('⚠️ Sidequests should not scroll - it has overflowY:', computedStyle.overflowY);
        }
      }
      
      console.debug('SIDEQUEST CHECK', {
        insideRightCol: !!document.querySelector('.md\\:col-span-5 [data-testid="sidequests"]'),
        scrollers: document.querySelectorAll('.overflow-y-auto').length,
        sidequestsOverflow: sidequestsEl ? getComputedStyle(sidequestsEl).overflowY : 'N/A'
      });
    }, 100);
  }
}, [mounted]);
```

### 4. Fixed Build Errors
- **POICard.tsx**: Removed unused `addToSidequests` function and imports
- **app/print/page.tsx**: Wrapped in Suspense boundary to fix Next.js build warning

## Results

✅ **Only TWO scrollbars total** (planner column and right column)
✅ **Sidequests grows naturally** and scrolls with the right column
✅ **No nested scroll traps** - clean scroll behavior
✅ **Dev guard warns** if Sidequests has its own scroller
✅ **Build succeeds** with no errors
✅ **Streamlined design** - more compact and cleaner UI

## Testing
The changes were verified by:
1. Running `pnpm build` - Build succeeded
2. Running `pnpm dev` - Dev server started successfully
3. Navigating to `/?from=palermo&date=2025-10-30`
4. Verifying scroll behavior works correctly
5. Console shows `SIDEQUEST CHECK` debug info confirming proper placement

## Files Modified
- `app/components/DayPlannerWrapper.tsx` - Grid column overflow settings
- `components/Sidequests.tsx` - Removed overflow and height constraints
- `components/POICard.tsx` - Fixed build errors
- `app/print/page.tsx` - Added Suspense boundary
