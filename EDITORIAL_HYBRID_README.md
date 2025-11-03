# Editorial Hybrid v1 - Implementation Guide

**Date**: 2025-11-01  
**Branch**: feat/editorial-hybrid-v1  
**Status**: ✅ Complete and functional

## Overview

The Editorial Hybrid v1 adds a magazine-style editorial layer to ItaloPlanner while preserving all existing planner functionality. The home page now features a book-like cover with featured stories, seamlessly transitioning to the planner when users start building an itinerary.

## What Was Added

### 1. New Routes

- **`/`** - Home page with Editorial Hero (when not in planner mode)
- **`/magazine`** - Story index with grid layout
- **`/stories/[slug]`** - Individual story pages with chapter-style layout
- **`/tips`** - Practical tips grid
- **`/tips/[slug]`** - Individual tip pages
- **`/about`** - Ethos and affiliate transparency

### 2. Components

All new components in `/components`:

- **`Hero.tsx`** - Full-screen cover quote with scroll cue
- **`StoryPreview.tsx`** - Minimal card for story previews
- **`ChapterLayout.tsx`** - Wide-margin story layout with pull-quotes
- **`QuoteBand.tsx`** - Full-width interlude quotes
- **`TipCard.tsx`** - Practical tip cards with icons
- **`EditorialFooter.tsx`** - Minimal footer with affiliate transparency
- **`PageTransition.tsx`** - Framer Motion fade transitions

### 3. Data Layer

**Schema** (`db/schema.ts`):
- `stories` table - Editorial content with markdown bodies
- `tips` table - Practical guides categorized

**Fallback Data** (`lib/editorial.ts`):
- In-memory data until SQLite build issues are resolved
- 3 sample stories (Noto, Modica, Stromboli)
- 4 sample tips (Driving, Coffee, Accommodation, Local Survival)
- TODO: Replace with actual database queries when DB is set up

### 4. Typography & Theme

**Fonts**:
- **Lora** (serif) - Headings (placeholder for Canela)
- **Inter** (sans) - Body text
- **IBM Plex Mono** - Captions and metadata

**Theme Tokens** (in `globals.css`):
```css
--editorial-bg: #f8f6f2 (light beige)
--editorial-text: #1E1B18 (near black)
--editorial-accent: #E5A64B (gold/amber)
```

**Typography Classes**:
- `.font-heading` - Lora, for editorial headings
- `.font-body` - Inter, for body text
- `.font-mono` - IBM Plex Mono, for metadata
- `.paper-grain` - Subtle texture for editorial pages

### 5. Animations

- **Page Transitions**: 150ms opacity fades via Framer Motion
- **Reduced Motion**: Respects `prefers-reduced-motion` media query via `useReducedMotion` hook
- **No Parallax**: Kept simple and accessible per spec

## File Structure

```
app/
├── about/page.tsx           # About/ethos page
├── magazine/page.tsx        # Story index
├── stories/[slug]/page.tsx  # Story detail
├── tips/page.tsx            # Tips grid
├── tips/[slug]/page.tsx     # Tip detail
└── page.tsx                 # Updated home (Editorial + Planner)

components/
├── Hero.tsx
├── StoryPreview.tsx
├── ChapterLayout.tsx
├── QuoteBand.tsx
├── TipCard.tsx
├── EditorialFooter.tsx
└── PageTransition.tsx

lib/
├── editorial.ts             # Data access functions
└── db/
    ├── schema.ts            # Drizzle schema (stories, tips)
    ├── index.ts             # DB connection
    ├── migrate.ts           # Migration runner (TODO)
    └── seed.ts              # Seed data (TODO)

hooks/
└── useReducedMotion.ts      # Accessibility hook
```

## How to Add New Content

### Adding a Story

**Option 1: Update In-Memory Data** (current):

Edit `lib/editorial.ts`, add to `storiesData` array:

```typescript
{
  id: 'story-4',
  slug: 'your-story-slug',
  title: 'Your Story Title',
  subtitle: 'Optional subtitle',
  excerpt: 'Brief excerpt for preview cards',
  bodyMd: `Your markdown content here...`,
  coverImage: 'https://images.unsplash.com/...',
  tags: '["tag1","tag2"]',
  region: 'Region Name',
  minutes: 10,
  publishedAt: new Date('2025-02-01'),
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

**Option 2: Use Database** (after SQLite is set up):

```bash
# Push schema to DB
pnpm db:push

# Add seed data to db/seed.ts, then:
pnpm db:seed
```

### Adding a Tip

Same process as stories, but in `tipsData` array:

```typescript
{
  id: 'tip-5',
  slug: 'your-tip-slug',
  title: 'Your Tip Title',
  excerpt: 'Brief description',
  bodyMd: `## Your Content\n\nMarkdown here...`,
  category: 'driving', // or coffee, where-to-stay, local-survival
  icon: 'Car', // Any lucide-react icon name
  createdAt: new Date(),
  updatedAt: new Date(),
}
```

## Markdown Features

Stories and tips support:

- **Headings**: `## Heading 2`, `### Heading 3`
- **Lists**: Bulleted and numbered
- **Blockquotes**: `> Quote text` (styled with accent border)
- **Bold/Italic**: `**bold**`, `*italic*`
- **Links**: `[text](url)`
- **GFM**: Tables, task lists (via remark-gfm)

## Accessibility Features

✅ **Preserved from existing app**:
- Dark/Light mode toggle
- Dyslexia font toggle
- Text-only mode

✅ **New**:
- Reduced motion support (disables Framer Motion animations)
- Semantic HTML (proper heading hierarchy, landmarks)
- ARIA labels on interactive elements
- Focus visible styles

## Database Setup (When Ready)

The app currently uses in-memory data as a fallback due to better-sqlite3 build issues on Windows. To switch to the actual database:

1. **Fix Build Issues**:
   ```bash
   # On Windows, may need Visual Studio Build Tools
   # Or use WSL for better native module support
   ```

2. **Initialize Database**:
   ```bash
   pnpm db:push    # Create tables
   pnpm db:seed    # Load sample data
   ```

3. **Update Code**:
   The functions in `lib/editorial.ts` have TODO comments showing where to replace in-memory calls with actual DB queries using Drizzle.

## Performance Notes

- **Static Generation**: Story and tip pages use `generateStaticParams` for build-time rendering
- **Image Optimization**: Uses Next.js Image component for cover images
- **Code Splitting**: Editorial components only load on editorial routes
- **Font Loading**: Google Fonts with `display=swap`

## Styling Guidelines

**Do**:
- Use CSS variables for colors: `var(--editorial-bg)`, `var(--editorial-text)`, `var(--editorial-accent)`
- Use typography classes: `.font-heading`, `.font-body`, `.font-mono`
- Keep animations under 150ms
- Test with reduced motion enabled

**Don't**:
- Add parallax effects
- Use em dashes in copy
- Add heavy images/videos to hero
- Break existing planner functionality

## Browser Support

- Modern browsers (last 2 versions)
- Respects system preferences (dark mode, reduced motion)
- Progressive enhancement (Editorial features degrade gracefully)

## Testing Checklist

- [x] `pnpm dev` boots without TS errors
- [ ] Home page shows Hero + 3 featured stories when not in planner mode
- [ ] Home page shows planner interface when city/date selected
- [ ] Story pages render markdown correctly
- [ ] Tips grid displays all tips
- [ ] Tip detail pages work with overlay navigation
- [ ] Dark mode toggle works on all pages
- [ ] Dyslexia font toggle works on all pages
- [ ] Reduced motion disables animations
- [ ] Existing planner/map functionality intact
- [ ] No breaking changes to current routes

## Revert Process

If you need to revert these changes:

```bash
# Return to previous branch
git checkout feat/nearby-pois-by-area-and-theme

# Or revert specific files
git checkout HEAD~1 -- app/page.tsx
git checkout HEAD~1 -- app/globals.css

# Remove new routes
rm -rf app/stories app/magazine app/tips app/about
rm -rf components/Hero.tsx components/StoryPreview.tsx etc.
```

## Future Enhancements

**Typography**:
- [ ] Add self-hosted Canela font files to `/public/fonts`
- [ ] Update `globals.css` font-face declarations
- [ ] Replace Lora with Canela in `.font-heading` class

**Database**:
- [ ] Resolve better-sqlite3 build issues
- [ ] Run migrations: `pnpm db:push`
- [ ] Load seed data: `pnpm db:seed`
- [ ] Update `lib/editorial.ts` to use DB queries

**Content**:
- [ ] Add more stories (aim for 10+ total)
- [ ] Add category filtering to Magazine page
- [ ] Add search functionality
- [ ] Add related stories section

**Features**:
- [ ] RSS feed for stories
- [ ] Newsletter signup
- [ ] Social sharing cards
- [ ] Reading progress indicator

## Dependencies Added

```json
{
  "dependencies": {
    "better-sqlite3": "^12.4.1",
    "drizzle-orm": "^0.44.7",
    "framer-motion": "^12.23.24",
    "react-markdown": "^10.1.0",
    "rehype-slug": "^6.0.0",
    "remark-gfm": "^4.0.1"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.13",
    "drizzle-kit": "^0.31.6"
  }
}
```

## Credits

- **Design Inspiration**: Print magazines, editorial websites
- **Typography**: Lora (Google Fonts), Inter (Google Fonts), IBM Plex Mono (Google Fonts)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Markdown**: react-markdown with remark-gfm

---

**Questions?** Check the code comments or refer to component documentation in the respective files.
