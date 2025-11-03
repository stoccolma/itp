// Editorial content management
// Fallback to in-memory data if database is not available

import type { Story, Tip } from '@/db/schema';

// TODO(region): when adding new regions, update query functions to accept region parameter
// and expose region filter in UI. For now, all data defaults to 'sicily'.

// Temporary in-memory data until database is properly initialized
// This allows development to continue while resolving better-sqlite3 build issues on Windows

const storiesData: Story[] = [
  {
    id: 'story-1',
    slug: 'noto-baroque-gold',
    title: 'Noto: Where Baroque Dreams in Gold',
    subtitle: 'A city rebuilt from earthquake ruins into Sicily\'s most beautiful secret',
    excerpt: 'After the 1693 earthquake leveled the old town, Noto\'s architects didn\'t rebuild—they reimagined. What rose from the rubble was pure theater: a stage set of honey-colored limestone that glows like molten gold at sunset.',
    bodyMd: `After the 1693 earthquake leveled the old town, Noto\'s architects didn't rebuild—they reimagined. What rose from the rubble was pure theater: a stage set of honey-colored limestone that glows like molten gold at sunset.

## The Corso Vittorio Emanuele

Walk the Corso Vittorio Emanuele at dusk, when the stone facades turn amber and the tourists thin out. The Cathedral dominates Piazza del Municipio like a wedding cake designed by someone who'd never heard the word "restraint."

> "The earthquake destroyed us. The baroque saved us. Now the tourists sustain us. This is the Sicilian way." — Local historian

## If You Go

- **Best time:** Late afternoon, 5-7pm, for the golden hour
- **Where to eat:** Caffè Sicilia for granita
- **Insider tip:** Climb to Chiesa di San Carlo roof terrace
- **Stay nearby:** Masseria Della Volpe, 10km outside town`,
    coverImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200',
    tags: '["baroque","architecture","southeast","unesco"]',
    region: 'sicily',
    minutes: 8,
    publishedAt: new Date('2025-01-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'story-2',
    slug: 'modica-chocolate-pilgrimage',
    title: 'Modica: A Chocolate Pilgrimage',
    subtitle: 'Where ancient Aztec recipes meet Sicilian obsession',
    excerpt: 'Modica\'s chocolate isn\'t smooth. It\'s not supposed to be. The sugar doesn\'t melt—it stays granular, crunchy, almost aggressive.',
    bodyMd: `Modica's chocolate isn't smooth. The sugar doesn't melt—it stays granular, crunchy, almost aggressive. This is chocolate the way the Aztecs made it.

## The Chocolate Houses

Antica Dolceria Bonajuto, founded in 1880, still uses stone grinders and refuses to heat the chocolate above 40°C.

> "We don't make chocolate. We preserve a tradition that should have died with the Spanish Empire." — Bonajuto chocolatier

## If You Go

- **Essential stop:** Antica Dolceria Bonajuto
- **Time needed:** Half day minimum`,
    coverImage: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=1200',
    tags: '["food","chocolate","baroque","southeast"]',
    region: 'sicily',
    minutes: 6,
    publishedAt: new Date('2025-01-20'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'story-3',
    slug: 'aeolian-islands-stromboli',
    title: 'Stromboli: Dining with a Volcano',
    subtitle: 'Where your seafood comes with a side of lava',
    excerpt: 'Stromboli erupts every 20 minutes. Not metaphorically. Literally. While you eat spaghetti alle vongole, the mountain coughs up glowing rocks.',
    bodyMd: `Stromboli erupts every 20 minutes. While you eat, the mountain behind you coughs up glowing rocks like clockwork.

## The Sciara del Fuoco

At night, watch orange ribbons of molten rock slide down the black mountainside.

> "When Stromboli is quiet, we worry. When it's active, we know it's healthy." — Island guide

## If You Go

- **Get here:** Hydrofoil from Milazzo (2.5 hours)
- **Where to stay:** Pensione Sciara Residence
- **Pack:** Good boots, headlamp, layers`,
    coverImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    tags: '["volcano","islands","adventure","aeolian"]',
    region: 'sicily',
    minutes: 7,
    publishedAt: new Date('2025-01-25'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const tipsData: Tip[] = [
  {
    id: 'tip-1',
    slug: 'driving-sicily-survival',
    title: 'Driving in Sicily: A Survival Guide',
    excerpt: 'Turn signals are optional, lanes are suggestions, and the horn is a second language.',
    bodyMd: `## The Rules

1. Lane markings are decorative
2. The horn means everything
3. ZTL zones will bankrupt you

## Mountain Roads

Roads built for donkeys, now used by Fiat Puntos doing 80km/h around blind hairpins.`,
    category: 'driving',
    icon: 'Car',
    region: 'sicily',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tip-2',
    slug: 'sicilian-coffee-rules',
    title: 'Coffee in Sicily: Unwritten Rules',
    excerpt: 'Cappuccino after noon is a mortal sin. Espresso is not a sipping drink.',
    bodyMd: `## The Golden Rules

1. No cappuccino after 11am
2. Espresso is a shot, not a session
3. Granita is breakfast

## Price Check

Espresso at the bar: €1-1.50
Espresso at a table: €3-4`,
    category: 'coffee',
    icon: 'Coffee',
    region: 'sicily',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tip-3',
    slug: 'where-to-stay',
    title: 'Where to Stay: Agriturismo vs. Hotels',
    excerpt: 'Skip the beach resort. Find a farmhouse where dinner is whatever the nonna is cooking.',
    bodyMd: `## The Case for Agriturismo

Working farm that feeds you food grown within shouting distance of your bed.

## Price Range

- Agriturismo: €60-120/night with half-board
- Mid-range hotel: €100-180/night
- Splurge hotel: €250+ (usually not worth it)`,
    category: 'where-to-stay',
    icon: 'Home',
    region: 'sicily',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tip-4',
    slug: 'local-survival-phrases',
    title: 'Local Survival: Beyond "Ciao"',
    excerpt: 'English works in tourist zones. Everywhere else, you need these phrases.',
    bodyMd: `## Essential Sicilian Phrases

- **Salutamu**: Hello
- **Grazie assai**: Thank you very much
- **Picca picca**: A little bit

## General Survival

- Shops close 1-4pm for lunch
- Restaurants open at 8pm
- "Domani" means "maybe never"`,
    category: 'local-survival',
    icon: 'Users',
    region: 'sicily',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Data access functions with region filtering
export async function getStories(options: { region?: string } = {}): Promise<Story[]> {
  const { region = 'sicily' } = options;
  // TODO: Replace with database query when DB is set up
  // const stories = await db.select().from(storiesTable)
  //   .where(eq(storiesTable.region, region))
  //   .orderBy(desc(storiesTable.publishedAt));
  return storiesData.filter((s) => s.region === region);
}

export async function getStoryBySlug(slug: string, options: { region?: string } = {}): Promise<Story | null> {
  const { region = 'sicily' } = options;
  // TODO: Replace with database query
  // const [story] = await db.select().from(storiesTable)
  //   .where(and(eq(storiesTable.slug, slug), eq(storiesTable.region, region)));
  const story = storiesData.find((s) => s.slug === slug && s.region === region);
  return story || null;
}

export async function getFeaturedStories(limit: number = 3, options: { region?: string } = {}): Promise<Story[]> {
  const { region = 'sicily' } = options;
  // TODO: Add featured flag to schema and filter
  // const stories = await db.select().from(storiesTable)
  //   .where(and(eq(storiesTable.featured, true), eq(storiesTable.region, region)))
  //   .limit(limit);
  return storiesData.filter((s) => s.region === region).slice(0, limit);
}

export async function getTips(options: { region?: string } = {}): Promise<Tip[]> {
  const { region = 'sicily' } = options;
  // TODO: Replace with database query
  // const tips = await db.select().from(tipsTable)
  //   .where(eq(tipsTable.region, region));
  return tipsData.filter((t) => t.region === region);
}

export async function getTipBySlug(slug: string, options: { region?: string } = {}): Promise<Tip | null> {
  const { region = 'sicily' } = options;
  // TODO: Replace with database query
  // const [tip] = await db.select().from(tipsTable)
  //   .where(and(eq(tipsTable.slug, slug), eq(tipsTable.region, region)));
  const tip = tipsData.find((t) => t.slug === slug && t.region === region);
  return tip || null;
}

export async function getTipsByCategory(category: string, options: { region?: string } = {}): Promise<Tip[]> {
  const { region = 'sicily' } = options;
  // TODO: Replace with database query
  // const tips = await db.select().from(tipsTable)
  //   .where(and(eq(tipsTable.category, category), eq(tipsTable.region, region)));
  return tipsData.filter((t) => t.category === category && t.region === region);
}

// Helper to parse tags
export function parseTags(tagsJson: string | null): string[] {
  if (!tagsJson) return [];
  try {
    return JSON.parse(tagsJson);
  } catch {
    return [];
  }
}
