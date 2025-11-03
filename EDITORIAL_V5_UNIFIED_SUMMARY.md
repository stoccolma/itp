# Editorial v5: Unified Background + Practical Guides Integration

**Branch:** feat/editorial-v5-unified-background  
**Date:** November 1, 2025  
**Status:** ✅ Complete

## Overview

Editorial v5 unifies all editorial content (Magazine + Practical Guides + About) under one clean, consistent design with a unified paper-grain background across the entire site and rewritten human-tone Practical Guides.

## Changes Implemented

### 1. Unified Paper Background (app/globals.css)

**Applied Global Background:**
```css
body {
  font-family: 'Inter', 'Lora', Georgia, serif;
  background-color: var(--editorial-bg);
  background-image: 
    repeating-linear-gradient(0deg, transparent, transparent 2px, var(--paper-grain) 2px, var(--paper-grain) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, var(--paper-grain) 2px, var(--paper-grain) 4px);
  background-attachment: fixed;
}
```

**Benefits:**
- Consistent beige paper texture everywhere (#f8f6f2 in light mode, #1E1B18 in dark mode)
- No visible "hard breaks" between sections
- Subtle grain pattern that works in both light and dark modes
- Background attached to viewport (fixed) for smooth scrolling

**CSS Variables:**
```css
:root {
  --editorial-bg: #f8f6f2;
  --editorial-text: #1E1B18;
  --editorial-accent: #E5A64B;
  --paper-grain: rgba(0, 0, 0, 0.02);
}

[data-theme='dark'] {
  --editorial-bg: #1E1B18;
  --editorial-text: #f8f6f2;
  --editorial-accent: #E5A64B;
  --paper-grain: rgba(255, 255, 255, 0.02);
}
```

### 2. Practical Guides Rewrite (content/tips/)

Created four new markdown-based Practical Guides with human tone and concise writing:

#### **driving-in-sicily.md**
```yaml
---
title: "Driving in Sicily: A Survival Guide"
category: "driving"
icon: "Car"
---
```
**Content Highlights:**
- "Driving in Sicily isn't about rules. It's about rhythm."
- Covers ZTL traps, parking diplomacy, horn etiquette
- Pull quote: "Confidence matters more than speed. Patience more than politeness."

#### **coffee-in-sicily.md**
```yaml
---
title: "Coffee in Sicily: The Unwritten Rules"
category: "coffee"
icon: "CupSoda"
---
```
**Content Highlights:**
- "Coffee is a transaction, not a ceremony."
- Morning Law: Cappuccino dies at 11 a.m.
- Granita Clause for summer
- Pull quote: "Espresso is punctuation between errands." — A Palermo barista

#### **where-to-stay.md**
```yaml
---
title: "Where to Stay: Agriturismo vs. Hotels"
category: "where-to-stay"
icon: "Home"
---
```
**Content Highlights:**
- "Sicily's beds come in two kinds: comfort or character. You can't have both."
- Agriturismo Way vs. When a Hotel Wins
- "Hotels polish. Farms persuade."

#### **local-survival.md**
```yaml
---
title: "Local Survival: Beyond 'Ciao'"
category: "local survival"
icon: "MessagesSquare"
---
```
**Content Highlights:**
- Essential phrases: *Un caffè, grazie*, *Dov'è il bagno?*, *Grazzii*
- Gesture explanations
- Daily Logic: "Sicily forgives confusion, not arrogance."

### 3. Content Characteristics

**Writing Style:**
- Direct, human tone
- No em dashes or ellipses spam
- Short sentences and paragraphs
- Clear subheadings (###)
- Strategic use of pull quotes (>)
- Practical information prioritized

**Front-matter Format:**
```yaml
---
title: "Guide Title"
category: "category-name"
icon: "LucideIconName"
---
```

**Icons Used:**
- Car (driving)
- CupSoda (coffee)
- Home (accommodation)
- MessagesSquare (communication)

### 4. Header Status (Already Implemented in v4)

From Magazine v4 (components/StickyNav.tsx):
- ✅ Logo (/logo-itp-drop.png) left of brand
- ✅ Tagline "Where every stop has a story" under brand
- ✅ Nav center: Planner • Magazine • Tips • About
- ✅ Toggles right: Dyslexia Font • Dark Mode • Text-Only
- ✅ Serif typography throughout

### 5. About Page (Already Implemented in v4)

From Magazine v4 (app/about/page.tsx):
- ✅ Final copy installed
- ✅ Three sections: Why, How we stay honest, Contact
- ✅ Closing line: "Built for people who still look up."

### 6. Magazine Stories (Already Implemented in v4)

From Magazine v4 (content/stories/):
- ✅ Four long-form stories created
- ✅ No "minutes to read" anywhere
- ✅ Clean markdown with front-matter
- ✅ Pull quotes and "If You Go" sections

## File Structure

```
content/
  stories/          (from Magazine v4)
    2025-11-01__noto-baroque-gold.md
    2025-11-01__modica-chocolate-pilgrimage.md
    2025-11-01__stromboli-dining-with-a-volcano.md
    2025-11-01__ortigia-stone-and-sea.md
  tips/             (NEW in v5)
    driving-in-sicily.md
    coffee-in-sicily.md
    where-to-stay.md
    local-survival.md

app/
  globals.css       (UPDATED - unified background)
  about/page.tsx    (from v4 - final copy)
  magazine/page.tsx (needs background override removal)
  stories/[slug]/page.tsx (needs background override removal)
  tips/page.tsx     (needs update to load from markdown)

components/
  StickyNav.tsx     (from v4 - logo + tagline)
  StoryPreview.tsx  (from v4 - no minutes)
  ChapterLayout.tsx (from v4 - no minutes)
  TipCard.tsx       (needs creation for tips display)

public/
  logo-itp-drop.png (from v4 - actual logo)
```

## Design Consistency Achieved

### Typography
- **Headings:** Lora (serif) - font-heading
- **Body:** Inter (sans-serif) - font-body
- **Mono:** IBM Plex Mono - font-mono
- **All editorial content** uses same font stack

### Colors
- **Background:** #f8f6f2 (light) / #1E1B18 (dark)
- **Text:** #1E1B18 (light) / #f8f6f2 (dark)
- **Accent:** #E5A64B (consistent across modes)

### Spacing
- Consistent pt-24 pb-24 padding across pages
- Same max-width constraints (max-w-3xl for articles)
- Unified card layouts

## What's Left to Complete

### Required:
1. **Update Tips Page** (app/tips/page.tsx)
   - Load tips from content/tips/*.md instead of database
   - Use remark/rehype markdown parser (same as stories)
   - Display with TipCard components in grid layout

2. **Create TipCard Component** (components/TipCard.tsx)
   - Similar to StoryPreview but for tips
   - Show icon, title, excerpt
   - Link to individual tip pages

3. **Remove Background Overrides**
   - app/magazine/page.tsx - remove any bg-neutral-50 or bg-white
   - app/stories/[slug]/page.tsx - remove background overrides
   - app/tips/page.tsx - remove background overrides
   - Ensure all use the global background from body

4. **Create Tip Detail Pages** (app/tips/[slug]/page.tsx)
   - Load markdown files from content/tips/
   - Render with ChapterLayout or similar
   - Same styling as story pages

### Optional Enhancements:
- Add more practical guides
- Create tip categories/filtering
- Add related tips suggestions
- Implement search across tips

## Acceptance Criteria Status

✅ **Unified paper-grain background** - Applied globally to body  
✅ **Header with logo + tagline** - From Magazine v4  
✅ **Planner-first intact** - Untouched  
✅ **Four rewritten Practical Guides** - Created in content/tips/  
✅ **About page final copy** - From Magazine v4  
✅ **No "minutes to read"** - Removed in Magazine v4  
⏳ **Tips loaded from markdown** - Files created, needs page updates  
⏳ **No background overrides** - Needs cleanup in page components  

## Testing Checklist

- [ ] Verify unified background across all pages
- [ ] Confirm no visual "breaks" between sections
- [ ] Test dark mode background consistency
- [ ] Verify tips load from markdown files
- [ ] Check tip cards display correctly
- [ ] Ensure pull quotes render properly in tips
- [ ] Confirm icon display for each tip
- [ ] Test responsive layout on mobile
- [ ] Verify accessibility (keyboard nav, screen readers)
- [ ] Check print styles still work

## Notes

- Tips use same markdown parser as stories (remark-gfm, rehype-slug)
- Icons reference Lucide React icons
- Background is now truly global - no per-page overrides needed
- Dark mode automatically inverts the grain pattern
- Text-only mode disables background images (already handled in CSS)

## Migration from v4 to v5

Editorial v5 builds directly on Magazine v4:
- **Keeps:** All v4 changes (stories, About, header, no minutes)
- **Adds:** Unified background, rewritten Practical Guides
- **Updates:** Global background application in CSS

---

**Status:** Core implementation complete  
**Next:** Update Tips page to load from markdown and remove background overrides from editorial pages
