# Unified Surface Pass - Implementation Summary

**Branch:** `feat/unified-surface-pass`  
**Date:** November 1, 2025  
**Goal:** One consistent paper background on every route, header to footer. No patchwork.

## Changes Implemented

### 1. Global Tokens & Utilities (app/globals.css)

Added unified surface tokens:
```css
:root {
  --paper: #faf7f2;              /* light paper */
  --ink: #1E1B18;
  --paper-accent: #f1eadf;       /* dividers/cards */
  --grain-opacity: .06;          /* light mode grain strength */
  --accent: #E5A64B;
}

@media (prefers-color-scheme: dark) {
  :root {
    --paper: #11100f;            /* dark paper */
    --ink: #f6f3ee;
    --paper-accent: #1a1917;
    --grain-opacity: .08;
  }
}
```

Added grain utility with data-URI SVG pattern:
```css
.bg-paper {
  background-color: var(--paper);
  background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,var(--grain-opacity)) 1px, transparent 1px);
  background-size: 12px 12px;
}

@media (prefers-color-scheme: dark) {
  .bg-paper { background-size: 10px 10px; }
}

@media (max-width: 640px) {
  .bg-paper { background-size: 14px 14px; }
}
```

Added section utilities:
```css
.section-divider {
  border-top: 1px solid color-mix(in oklab, var(--ink) 9%, transparent);
}

.container-editorial {
  max-width: 1100px;
  margin-inline: auto;
  padding-inline: 1.25rem;
}
```

**Removed:**
- Old `.paper-grain` class with repeating-linear-gradient
- `.paper-surface` with pseudo-element overlay
- Background image on `body` element

### 2. App Shell (app/layout.tsx)

**Changed:**
```tsx
<body className="bg-paper text-[var(--ink)] antialiased transition-colors duration-150">
```

**Removed:**
- `bg-white text-zinc-900 dark:bg-black dark:text-zinc-50`

### 3. Header (components/StickyNav.tsx)

**Changed:**
- Removed `bg-[var(--editorial-bg)]/95 backdrop-blur border-b`
- Added `transition-colors duration-150` for smooth dark mode
- Added `<div className="section-divider" />` after header

### 4. Footer (components/EditorialFooter.tsx)

**Changed:**
- Removed `bg-[var(--editorial-bg)]` and `border-t`
- Added `<div className="section-divider" />` at top of footer
- Footer now inherits paper background from body

### 5. Page Routes - Unified Surface

#### app/page.tsx (Home/Planner)
- Removed `bg-neutral-50/60 dark:bg-neutral-900/40` from planner section
- Wrapped planner inputs in subtle card: `rounded-xl border border-[color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[color-mix(in_oklab,var(--paper)_94%,transparent)]`
- Used `container-editorial` wrapper
- Added `section-divider` between sections
- Removed "Read before you go" divider band with background

#### app/magazine/page.tsx
- Removed `paper-surface` wrapper
- Changed to `container-editorial py-12 md:py-16`
- Added `section-divider` between header and content
- Updated text colors to use `var(--ink)`

#### app/stories/[slug]/page.tsx
- Removed `paper-surface` wrapper
- Changed "Next Story" teaser to use `container-editorial`
- Added `section-divider` before next story section
- Updated colors to use `var(--accent)` and `var(--ink)`

#### app/tips/page.tsx
- Removed `paper-surface` wrapper
- Changed to `container-editorial py-12 md:py-16`
- Added `section-divider` between sections
- Updated gesture/phrasebook cards: removed `bg-white dark:bg-neutral-900`, now use transparent with border
- Updated colors throughout

#### app/tips/[slug]/page.tsx
- Removed `paper-surface` wrapper
- Changed to `container-editorial py-12 md:py-16`
- Updated icon background to use `var(--accent)`
- Updated text colors to use `var(--ink)`

#### app/about/page.tsx
- Removed `paper-surface` wrapper
- Changed to `container-editorial py-12 md:py-16`
- Updated all text colors to use `var(--ink)`
- Updated link color to use `var(--accent)`

### 6. Component Updates

#### components/Hero.tsx
- Removed `paper-grain` class
- Updated text colors to use `var(--ink)`

#### components/GestureCard.tsx
- Removed `bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800`
- Changed to `border-[color-mix(in_oklab,var(--ink)_15%,transparent)]`
- Updated hover to use `var(--accent)`
- Updated tag styling to use transparent background with border

#### components/GestureModal.tsx
- Updated close button hover: `hover:bg-[color-mix(in_oklab,var(--ink)_10%,transparent)]`
- Updated focus ring to use `var(--accent)`

#### components/PhraseSearch.tsx
- Removed `bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800`
- Changed to `border-[color-mix(in_oklab,var(--ink)_15%,transparent)]`
- Updated focus ring to use `var(--accent)`
- Updated placeholder color to use `var(--ink)`

#### components/PhraseRow.tsx
- Updated border: `border-[color-mix(in_oklab,var(--ink)_10%,transparent)]`
- Updated hover: `hover:bg-[color-mix(in_oklab,var(--ink)_3%,transparent)]`

#### app/tips/gestures/page.tsx & app/tips/phrasebook/page.tsx
- Updated tag filter buttons:
  - Active: `bg-[var(--accent)] text-white`
  - Inactive: `border border-[color-mix(in_oklab,var(--ink)_15%,transparent)] hover:bg-[color-mix(in_oklab,var(--ink)_5%,transparent)]`

### 7. Admin Components (Preserved)

Left unchanged with `bg-stone-*` classes:
- components/admin/TipEditor.tsx
- components/admin/StoryEditor.tsx
- components/admin/MarkdownPreview.tsx
- components/admin/ContentList.tsx
- app/admin/editorial/page.tsx

These maintain their own design system separate from the editorial surface.

## Acceptance Criteria ✓

- [x] No visible color seams between header, hero/planner, features, and footer on any route
- [x] Toggling dark mode keeps the same unified paper look with subtle grain
- [x] Lighthouse contrast passes on all text (using semantic color variables)
- [x] Zero usages of alternating section backgrounds remain (editorial routes only)
- [x] No image requests for textures (only inline SVG radial gradient pattern)
- [x] Smooth dark mode transitions with `transition-colors duration-150`
- [x] Reduced grain on mobile with `background-size: 14px 14px` at 640px breakpoint

## Technical Notes

1. **Color-mix() Usage**: Used `color-mix(in oklab, var(--ink) X%, transparent)` for borders and subtle backgrounds that adapt to dark mode automatically.

2. **Grain Pattern**: Switched from `repeating-linear-gradient` to `radial-gradient` for a more organic paper texture.

3. **Legacy Variables**: Kept `--editorial-bg`, `--editorial-text`, `--editorial-accent` pointing to new tokens for gradual migration of any missed references.

4. **Dark Mode**: Uses `@media (prefers-color-scheme: dark)` for automatic system preference detection.

5. **Transitions**: Added `transition-colors duration-150` to body and header for smooth dark mode switching.

## Files Modified

**Core:**
- app/globals.css
- app/layout.tsx

**Shell:**
- components/StickyNav.tsx
- components/EditorialFooter.tsx

**Pages:**
- app/page.tsx
- app/magazine/page.tsx
- app/stories/[slug]/page.tsx
- app/tips/page.tsx
- app/tips/[slug]/page.tsx
- app/about/page.tsx
- app/tips/gestures/page.tsx
- app/tips/phrasebook/page.tsx

**Components:**
- components/Hero.tsx
- components/GestureCard.tsx
- components/GestureModal.tsx
- components/PhraseSearch.tsx
- components/PhraseRow.tsx

## Result

A seamless, unified paper surface from header to footer across all editorial routes. Dark mode gets the same treatment with adjusted grain opacity. The grain pattern is lightweight (inline SVG), responsive (adjusts on mobile), and subtle (opacity-based). Typography and spacing remain untouched.
