# Light Mode Default Fix Summary

**Branch:** `fix/light-default-one-paper`

## Objective
Force light mode as the default theme with white-ish "paper" background everywhere, eliminating auto-dark mode behavior and ensuring dark mode only activates when explicitly toggled by the user.

## Changes Made

### 1. Tailwind Configuration ✅
**File:** `tailwind.config.js`
- Already configured with `darkMode: 'class'` (not 'media')
- This ensures dark mode only activates via class/attribute, not system preference

### 2. Layout Updates ✅
**File:** `app/layout.tsx`
- Added `data-theme="light"` to `<html>` tag to force light mode on initial render
- Added `suppressHydrationWarning` to prevent hydration mismatches
- Removed transition classes that were causing flicker
- Removed unnecessary theme-setting `useEffect` that was duplicating AccessibilityContext logic

### 3. CSS Variables - Light First ✅
**File:** `app/globals.css`

**Removed:**
- `@media (prefers-color-scheme: dark)` block that was auto-switching to dark mode
- Old dark mode Tailwind utilities in `.nav-link`

**Added:**
- Explicit `[data-theme="light"]` selector with full variable set
- Enhanced `[data-theme="dark"]` with complete variable definitions
- New CSS variables:
  - `--card`: `color-mix(in oklab, var(--paper) 96%, black 4%)`
  - `--line`: `color-mix(in oklab, var(--ink) 10%, transparent)`
- Pure CSS nav-link styles instead of Tailwind utilities

**Default Variables (Light):**
```css
:root, [data-theme="light"] {
  --paper: #faf7f2;
  --ink: #1e1b18;
  --accent: #e5a64b;
  --paper-accent: #f1eadf;
  --grain-opacity: .06;
  --card: color-mix(in oklab, var(--paper) 96%, black 4%);
  --line: color-mix(in oklab, var(--ink) 10%, transparent);
}
```

**Dark Variables (Only When Toggled):**
```css
[data-theme="dark"] {
  --paper: #11100f;
  --ink: #f4efe9;
  --accent: #e5a64b;
  --paper-accent: #1a1917;
  --grain-opacity: .08;
  --card: color-mix(in oklab, var(--paper) 94%, white 6%);
  --line: color-mix(in oklab, var(--ink) 12%, transparent);
}
```

### 4. AccessibilityContext Updates ✅
**File:** `contexts/AccessibilityContext.tsx`

**Changes:**
- Loads saved theme from `localStorage` on mount
- Uses `data-theme` attribute instead of `class="dark"`
- Explicitly removes any `dark` class from `<html>` element
- Persists theme choice to `localStorage`
- Defaults to `light` if no saved preference exists

### 5. Theme Script Integration ✅
Theme initialization is handled by `AccessibilityContext` which:
- Checks `localStorage` for saved theme preference
- Defaults to light mode if none exists
- Sets `data-theme` attribute on `<html>` element
- Removes any rogue `dark` class

### 6. Remove Tailwind Dark Utilities ✅
**Script:** `scripts/remove-dark-utilities.js`

Created automated script that removed dark mode utilities from 14 files:
- Replaced `dark:bg-*` with `bg-[var(--card)]` or `bg-[var(--paper)]`
- Replaced `dark:text-*` with `text-[var(--ink)]` variants
- Replaced `dark:border-*` with `border-[var(--line)]`
- Removed hover/focus dark utilities (they inherit from base classes)

**Files Updated:**
- `app/qa/page.tsx`
- `app/components/SicilyFooter.tsx`
- `app/components/ItaloMap.tsx`
- `app/components/HelpAgent.tsx`
- `app/components/DestinationStory.tsx`
- `app/components/DayPlannerWrapper.tsx`
- `components/SidequestsList.tsx`
- `components/QuickStops.tsx`
- `components/OneLinePlanner.tsx`
- `components/NearbyList.tsx`
- `components/GestureModal.tsx`
- `components/FrontPlanner.tsx`
- `components/DraggablePOIList.tsx`
- `components/DayPlanner.tsx`

### 7. Planner Card Styling ✅
**File:** `app/page.tsx`

Updated planner card to use CSS variables:
```tsx
<div className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 md:p-6">
  <OneLinePlanner />
</div>
```

### 8. Meta Tags Verification ✅
- No problematic `color-scheme` or `theme-color` meta tags found
- No removal needed

## Verification ✅

**DevTools Check:**
- `<html>` element has `data-theme="light"` attribute
- No `class="dark"` on `<html>` element
- `getComputedStyle(document.body).backgroundColor` resolves to `#faf7f2` (paper color)

**Visual Check:**
- Fresh load shows white-ish paper background (#faf7f2)
- Grain texture visible
- Text properly contrasted with --ink color (#1e1b18)
- Planner card has subtle background using --card variable
- No sections render with different backgrounds unless explicitly using `bg-[var(--card)]`

**Functionality:**
- Dark mode only engages after user toggles accessibility option
- Theme preference persists in localStorage
- No auto-dark mode based on system preferences

## Acceptance Criteria Met ✅

1. ✅ Fresh load = white-ish paper (#faf7f2), not black
2. ✅ No section renders different background than paper unless explicitly `bg-[var(--card)]`
3. ✅ Dark only engages after user toggle
4. ✅ Tailwind config set to `class` mode only
5. ✅ HTML never gets `class="dark"`, only `data-theme` attribute
6. ✅ No `@media (prefers-color-scheme: dark)` in CSS
7. ✅ Light variables defined first at `:root`
8. ✅ All Tailwind dark utilities replaced with var-driven classes
9. ✅ Planner card styled with `bg-[var(--card)]` and `border-[var(--line)]`

## Key Architecture

**Theme System:**
- **Attribute-based:** Uses `data-theme="light|dark"` on `<html>` element
- **No classes:** Removed all `class="dark"` usage
- **CSS variables:** All colors use CSS custom properties
- **Persistent:** Saves to `localStorage` with key `theme`
- **Default:** Always starts with `light` unless user has saved `dark` preference

**Color Tokens:**
- `--paper`: Main background (#faf7f2 light, #11100f dark)
- `--ink`: Main text (#1e1b18 light, #f4efe9 dark)
- `--card`: Card backgrounds (4% darker than paper)
- `--line`: Border/divider lines (10% opacity ink)
- `--accent`: Accent color (#e5a64b for both themes)

## Files Modified
1. `tailwind.config.js` - Already correct
2. `app/layout.tsx` - Force light theme, add suppressHydrationWarning
3. `app/globals.css` - Remove auto-dark, add light-first variables
4. `contexts/AccessibilityContext.tsx` - Use data-theme, localStorage
5. `app/page.tsx` - Planner card with CSS variables
6. `scripts/remove-dark-utilities.js` - Created cleanup script
7. 14 component files - Removed dark utilities via script

## Commands Used
```bash
node scripts/remove-dark-utilities.js  # Remove dark utilities from components
npm run dev                             # Verify changes
```

## Result
✅ Light mode is now the forced default everywhere. The site loads with the white-ish "paper" background, proper grain texture, and excellent readability. Dark mode only activates when the user explicitly toggles it via the accessibility menu.
