# Editorial Hybrid v1 - Project Audit

**Date**: 2025-11-01  
**Branch**: feat/nearby-pois-by-area-and-theme (current)  
**Working Directory**: c:\Users\azalb\Desktop\itp

## Current State

### Framework & Dependencies
✅ **Next.js**: v15.0.0 with App Router  
✅ **React**: v18.3.0  
✅ **TypeScript**: v5.3.0  
✅ **Tailwind CSS**: v3.4.0  
⚠️ **No Drizzle ORM** - needs installation  
⚠️ **No SQLite** - needs installation  
⚠️ **No Framer Motion** - needs installation  
⚠️ **No react-markdown** - needs installation  

### Current Fonts
✅ **Lora** (serif, Google Fonts) - used for body text  
✅ **OpenDyslexic** (CDN) - accessibility  
❌ **Canela** - MISSING (needs self-hosting)  
❌ **Inter** - MISSING (needs addition)  
❌ **IBM Plex Mono** - MISSING (needs addition)  

### Accessibility Features
✅ Dark/Light mode toggle (AccessibilityContext)  
✅ Dyslexia font toggle  
✅ Text-only mode  
✅ Reduced motion support - PENDING verification  

### Existing Pages
- `/` - Home (FrontPlanner entry)  
- `/city/[id]` - City details  
- `/areas/[slug]` - Area pages  
- `/articles` - Articles listing  
- `/sidequests` - Sidequests  
- `/print` - Print itinerary  
- `/qa` - Q&A page  
- `/debug/areas` - Debug utilities  
- `/admin/areas/[slug]/images` - Admin tools  

### Route Collisions (Editorial Spec)
❌ `/stories/[slug]` - NEW, no collision  
❌ `/magazine` - NEW, no collision  
❌ `/tips` - NEW, no collision  
❌ `/about` - NEW, no collision  
✅ `/` - EXISTS, will be UPDATED (not broken)  

### Data Layer
**Current**: Hardcoded TypeScript exports in `lib/data.ts`  
- Cities array (6 cities)  
- POIs array (12 POIs)  
- No database, no ORM  

**Schema**: Basic TypeScript types in `lib/types.ts`  
- City interface  
- POI interface  
- Plan/Itinerary types  

**Migration Plan**:  
- Keep existing data.ts intact for backward compatibility  
- Add Drizzle + SQLite for new editorial content  
- New tables: `stories`, `tips`  
- Seed without overwriting existing data  

### Existing Components (Relevant)
- `Navigation.tsx` - needs update for new routes  
- `contexts/AccessibilityContext.tsx` - keep intact ✅  
- Various planner components - preserve ✅  

### Theme/Colors
**Current palette** (in globals.css):  
- Sand: #DEDED1  
- Linen: #C5C7BC  
- Moss: #B6AE9F  
- Sun: #FBF3D1  
- Terracotta: #bfa094  
- Gold: #d4af37  
- Sage: #5f7362  
- Espresso: #2c2420  
- Cream: #fdf8f6  

**Editorial spec additions**:  
- bg-[#f8f6f2] (light beige)  
- text-[#1E1B18] (near black)  
- accent-[#E5A64B] (gold/amber)  

### Git Status
**Branch**: feat/nearby-pois-by-area-and-theme  
**Uncommitted changes**: Yes (various planner improvements)  
**Action needed**: Commit current work, create new checkpoint branch  

## Implementation Plan

### Phase 1: Setup (Environment)
1. Commit current uncommitted changes  
2. Create checkpoint branch: `feat/editorial-hybrid-v1`  
3. Install dependencies:
   - `drizzle-orm`
   - `better-sqlite3`
   - `drizzle-kit`
   - `framer-motion`
   - `react-markdown`
   - `rehype-slug`
   - `@next/font` (if needed for self-hosting)

### Phase 2: Typography & Assets
1. Download/add Canela font files (self-hosted)  
2. Add Inter from Google Fonts  
3. Add IBM Plex Mono from Google Fonts  
4. Update globals.css with typography scale  
5. Add paper grain texture (CSS or tiny PNG)  

### Phase 3: Database Layer
1. Create `db/schema.ts` with Drizzle schema  
2. Add `stories` table  
3. Add `tips` table  
4. Create migrations  
5. Create seed scripts (non-destructive)  
6. Keep lib/data.ts for existing POI/city data  

### Phase 4: Core Components
1. `Hero.tsx` - cover quote + scroll cue  
2. `StoryPreview.tsx` - minimal card  
3. `ChapterLayout.tsx` - story page layout  
4. `QuoteBand.tsx` - full-width interlude  
5. `TipCard.tsx` - tips grid card  
6. Update `Nav.tsx` - add new routes  
7. `Footer.tsx` - affiliate transparency  
8. `PageTransition.tsx` - Framer Motion wrapper  

### Phase 5: Routes
1. Update `/page.tsx` - Editorial home  
2. Create `/stories/[slug]/page.tsx`  
3. Create `/magazine/page.tsx`  
4. Create `/tips/page.tsx`  
5. Create `/about/page.tsx`  

### Phase 6: Integration & Testing
1. Test all routes with `pnpm dev`  
2. Verify accessibility toggles work  
3. Test prefers-reduced-motion  
4. Lighthouse accessibility audit  
5. Verify existing planner/map logic intact  

## Non-Breaking Guarantees
- Existing `/city/[id]` routes preserved  
- Existing `/areas/[slug]` routes preserved  
- POI data and logic unchanged  
- Map functionality intact  
- Accessibility features enhanced, not replaced  
- All current links continue to work  

## Acceptance Criteria Checklist
- [ ] pnpm dev boots with no TS errors  
- [ ] Lighthouse: no accessibility regressions  
- [ ] prefers-reduced-motion honored  
- [ ] Home renders 3 featured stories from DB  
- [ ] Story page shows pull-quote, inline image, "If you go" block, next-story teaser  
- [ ] Tips grid loads; overlay route works  
- [ ] Dark/light + dyslexia toggle functional on all pages  
- [ ] No breaking route changes  
- [ ] Animations under 150ms opacity fades  
- [ ] Existing planner/map logic intact
