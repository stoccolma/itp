# ItaloPlanner 🇮🇹

An Italian travel web application focused on authentic experiences, built with Next.js 15, TypeScript, and a vintage Italian editorial aesthetic.

## Features

- **Vintage Italian Design**: Terracotta, gold, sage, and espresso color palette
- **Accessibility First**: Dyslexia fonts, dark mode, text-only modes
- **Mobile-First Design**: Centered layout optimized for mobile devices
- **City & Date Selection**: Simple dropdown to select city and travel date
- **City Exploration**: Discover 6 Sicilian cities with rich, evocative descriptions
- **POI Cards**: Places of interest with detailed narrative descriptions
- **Drag-and-Drop Day Planner**: Build your itinerary with intuitive drag-and-drop
- **Sidequests**: Bookmark places for later
- **Privacy-First**: No tracking, no data selling
- **Support Local**: Focus on authentic, local businesses

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag and Drop**: @dnd-kit
- **Icons**: Lucide React
- **Fonts**: Lora (serif), OpenDyslexic (accessibility)

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Project Structure

```
italoplanner/
├── app/                    # Next.js 15 App Router
│   ├── page.tsx           # Home page (city grid)
│   ├── layout.tsx         # Root layout with providers
│   ├── globals.css        # Global styles & Tailwind
│   ├── city/[id]/         # Dynamic city pages
│   │   └── page.tsx
│   ├── planner/           # Day planner page
│   │   └── page.tsx
│   ├── sidequests/        # Saved places
│   │   └── page.tsx
│   └── articles/          # Travel articles
│       └── page.tsx
├── components/            # React components
│   ├── Navigation.tsx     # Nav with accessibility controls
│   ├── CityCard.tsx       # City preview cards
│   ├── POICard.tsx        # Place of interest cards
│   └── DayPlanner.tsx     # Drag-and-drop day planner
├── contexts/              # React Context providers
│   ├── AccessibilityContext.tsx
│   └── PlannerContext.tsx
├── lib/                   # Utilities and data
│   ├── types.ts          # TypeScript definitions
│   └── data.ts           # Sample cities and POIs
└── package.json

```

## Core Philosophy

### Privacy First
- No tracking or analytics
- No data selling
- Your plans stay yours

### Support Local
- Every recommendation supports real people
- No chain restaurants or tourist traps
- Free listings for local businesses

### Slow Travel
- Fewer photos, more memories
- Less planning, more discovery
- Quality over quantity

## Sample Content

The app includes rich sample data for 6 Sicilian cities:

1. **Palermo** - Markets, street food, baroque chaos
2. **Ortigia** - Ancient Greek temples, fresh ricotta
3. **Aci Castello** - Norman castle, volcanic beaches
4. **Mazara del Vallo** - Red prawns, Dancing Satyr, Tunisian quarter
5. **Marzamemi** - Fishing village, tonnara, tiny piazza
6. **Giardini Naxos** - Greek ruins, beaches, Mt. Etna views

Each location includes POIs with Tucci-style descriptions that emphasize:
- Sensory details (taste, texture, smell)
- Emotional resonance
- Local context and history
- Personal, intimate perspective

## Accessibility Features

Toggle these in the navigation menu:

- **Dyslexia Font**: OpenDyslexic font family
- **Reduced Motion**: Disables animations
- **High Contrast**: Enhanced color contrast
- **Text Only**: Removes background images

## Customization

### Adding New Cities

Edit `/lib/data.ts`:

```typescript
export const cities: City[] = [
  {
    id: 'your-city',
    name: 'Your City',
    region: 'Sicily',
    description: 'Evocative description...',
    imageUrl: 'https://...',
    highlights: ['Highlight 1', 'Highlight 2'],
  },
  // ... more cities
];
```

### Adding New POIs

Edit `/lib/data.ts`:

```typescript
export const pois: POI[] = [
  {
    id: 'unique-id',
    name: 'Place Name',
    city: 'city-id',
    type: 'restaurant', // or cafe, attraction, shop, activity
    description: 'Brief description',
    detailedDescription: 'Rich, sensory, narrative description...',
    address: 'Full address',
    coordinates: { lat: 0, lng: 0 },
    priceRange: '$$',
    timing: 'Lunch & Dinner',
    tags: ['tag1', 'tag2'],
  },
  // ... more POIs
];
```

### Customizing Colors

Edit `/tailwind.config.js` to adjust the vintage Italian palette:

```javascript
colors: {
  terracotta: { ... },
  gold: { ... },
  sage: { ... },
  espresso: { ... },
}
```

## Future Enhancements

- Interactive maps (Mapbox or Google Maps)
- Weather integration
- User accounts (optional, privacy-respecting)
- Export itineraries to PDF
- Multi-language support
- More regions beyond Sicily
- Advanced filtering and search
- Integration with booking platforms

## Writing Style Guide

When adding content, follow these principles:

1. **Sensory First**: Describe taste, texture, smell, sound
2. **Emotional Connection**: How does it feel to be there?
3. **Avoid Lists**: Use narrative prose, not bullet points
4. **Be Specific**: Use vivid, concrete details rather than generic descriptions
5. **Local Context**: Why does this place matter to locals?
6. **Intimate Tone**: Write like you're telling a friend
7. **No Clichés**: Skip overused travel phrases

## License

This is a demo project. Feel free to use and modify as needed.

## Credits

- Built with Next.js, React, and Tailwind CSS
- Sample images from Unsplash

---

**ItaloPlanner** - Because Italy deserves better than a checklist.
