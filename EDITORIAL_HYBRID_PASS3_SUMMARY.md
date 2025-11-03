# Editorial Hybrid Pass 3 - Planner First

**Branch**: feat/editorial-hybrid-pass3-planner-first  
**Date**: 2025-11-01  
**Status**: ✅ Complete

## Overview

Implemented "planner-first" approach by simplifying the header and moving the planner to the top of the homepage. Users now land directly on the planning interface instead of seeing editorial content first.

## Changes Implemented

### 1. Simplified Sticky Header

**Updated**: `components/StickyNav.tsx`

**Removed**:
- All taglines ("Where every stop has a story", "Sicily in stories and routes")
- "Home" link (logo now serves this purpose)
- Responsive visibility complexity

**Simplified Layout**:
- **Left**: Logo only
- **Center**: Planner • Magazine • Tips • About (in that order)
- **Right**: Dyslexia Font • Dark Mode • Text-Only

**Technical Changes**:
- Fixed height: `h-16` instead of `py-3`
- Cleaner spacing: `gap-4` instead of variable gaps
- Removed flex-wrap and ordering complexity
- Maintained all accessibility features (ARIA attributes, focus states)

### 2. Planner-First Homepage

**Updated**: `app/page.tsx`

**Removed**:
- Large hero section with "ItaloPlanner helps you plan real Sicilian days..."
- "Start Planning" scroll cue
- Planner teaser section
- Quote band
- All editorial content shown by default

**New Layout Order**:
1. **Planner Section** (top of page, always visible)
   - Heading: "Plan your day"
   - Subtext: "Pick a city and date to build your itinerary. The map appears when you're ready."
   - Planner inputs
   - Map (only shows after city/date selected)

2. **Divider** ("Read before you go" - only when NOT planning)

3. **Featured Stories** (only when NOT planning)

4. **Footer** (Editorial or Sicily based on planning state)

**Key Behavior**:
- Map hidden until city + date selected ✅
- Featured stories hidden when planning ✅
- Planner is first thing users see ✅
- Clearer messaging about when map appears ✅

### 3. Visual Refinements

**Planner Section**:
- Padding: `pt-16 pb-24` (64px top, 96px bottom)
- Background: `bg-neutral-50/60 dark:bg-neutral-900/40`
- Border: `border-b border-black/5`
- No paper-grain texture (editorial sections only)

**Divider**:
- Only shows when not planning
- Simple uppercase text: "Read before you go"
- Neutral styling to match planner aesthetic

**Featured Stories**:
- Maintains paper-grain texture
- Only visible when homepage is in "browse" mode (no planning active)

## File Changes

### Modified (2 files)
- `components/StickyNav.tsx` - Simplified header layout
- `app/page.tsx` - Planner-first layout

### Lines Changed
- **StickyNav**: -35 lines of complexity
- **Home Page**: -70 lines of hero content, +15 lines of streamlined layout
- **Net change**: ~90 lines removed

## Acceptance Criteria

✅ **Single header only** - No brown strip, no duplicates  
✅ **Nav order correct** - Planner • Magazine • Tips • About  
✅ **Logo only in header** - No taglines  
✅ **Planner on top** - First visible section  
✅ **Map hidden until ready** - Shows after city/date selection  
✅ **Stories below planner** - Only when not planning  
✅ **Accessibility toggles work** - Visible pressed states  
✅ **No new dependencies** - Zero added  
✅ **Clean dev run** - No errors  

## User Flow Comparison

### Before (Pass 2):
1. Large hero text explaining value prop
2. Planner teaser
3. Divider
4. Featured stories
5. Quote band
6. Planner section (scrolled to via #planner anchor)

### After (Pass 3):
1. **Planner** (immediately visible)
2. Divider (if not planning)
3. Featured stories (if not planning)
4. Footer

**Result**: 
- 3 fewer sections to scroll past
- Immediate access to core functionality
- Editorial content available but not blocking

## Technical Details

**Header Height**: Fixed 64px (h-16)  
**Planner Padding**: 64px top, 96px bottom  
**Map Behavior**: Conditional render based on `canStart`  
**Stories Behavior**: Conditional render based on `!canStart`  

**Performance**: 
- No additional JavaScript
- Fewer DOM elements on initial load
- Faster time-to-interactive for planning

## Testing Results

✅ Homepage loads directly to planner  
✅ Map hidden until inputs filled  
✅ Featured stories appear below when not planning  
✅ Navigation functional  
✅ All accessibility toggles work  
✅ Mobile responsive  
✅ No TypeScript errors  
✅ No console errors  

## Migration Notes

**Breaking Changes**: None (all existing routes preserved)  
**Database Changes**: None  
**Environment Variables**: None  

**Reverting**:
```bash
git checkout feat/editorial-hybrid-pass2-home
```

## Design Philosophy

**"Planner First" Rationale**:
- Users come to "ItaloPlanner" to plan
- Editorial content enriches but shouldn't block
- Faster path to value
- Clear, focused entry point
- Editorial still discoverable via nav and when browsing

**Simplification Benefits**:
- Less cognitive load
- Clearer hierarchy
- Faster loading perception
- More purposeful navigation

## Next Steps (Optional)

- [ ] Add active nav state highlighting
- [ ] Consider sticky planner inputs when scrolling
- [ ] Add quick "Browse Stories" CTA in planner area
- [ ] Analytics to compare engagement vs. previous layout
- [ ] A/B test planner-first vs. editorial-first

## Commit Message

```
refactor(nav): simplify to single sticky header with planner link

- Remove all taglines
- Simplify header layout: Logo | Nav | Toggles
- Change nav order to: Planner • Magazine • Tips • About
- Remove Home link (logo serves this purpose)
- Use fixed height (h-16)
- Cleaner gap spacing
- Maintain all accessibility features

feat(home): move planner block to top

- Remove large hero section text
- Planner becomes first visible section
- Hide map until city/date selected
- Featured stories only show when not planning
- Add clear instruction: "The map appears when you're ready"
- Streamlined layout: Planner → Divider → Stories → Footer
- Remove 70+ lines of redundant intro content
```

---

**Result**: Clean, focused homepage that leads with planning functionality while keeping editorial content accessible.
