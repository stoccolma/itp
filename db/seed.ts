import { db } from './index';
import { stories, tips, type NewStory, type NewTip } from './schema';

// Sample stories for seeding
const sampleStories: NewStory[] = [
  {
    id: 'story-1',
    slug: 'noto-baroque-gold',
    title: 'Noto: Where Baroque Dreams in Gold',
    subtitle: 'A city rebuilt from earthquake ruins into Sicily\'s most beautiful secret',
    excerpt: 'After the 1693 earthquake leveled the old town, Noto\'s architects didn\'t rebuild—they reimagined. What rose from the rubble was pure theater: a stage set of honey-colored limestone that glows like molten gold at sunset.',
    bodyMd: `After the 1693 earthquake leveled the old town, Noto\'s architects didn't rebuild—they reimagined. What rose from the rubble was pure theater: a stage set of honey-colored limestone that glows like molten gold at sunset.

## The Corso Vittorio Emanuele

Walk the Corso Vittorio Emanuele at dusk, when the stone facades turn amber and the tourists thin out. The Cathedral dominates Piazza del Municipio like a wedding cake designed by someone who'd never heard the word "restraint." Its steps are wide enough to host a small army, and locals use them exactly that way—sitting, chatting, watching the light show that happens every single evening without fail.

> "The earthquake destroyed us. The baroque saved us. Now the tourists sustain us. This is the Sicilian way." — Local historian

## Beyond the Cathedral

But Noto isn't just its cathedral. Turn down Via Nicolaci and you'll find balconies supported by grotesque figures—cherubs and demons frozen mid-grimace, holding up the weight of centuries. The Palazzo Villadorata is the star here, its balcony brackets carved into mythological creatures that look perpetually surprised to still be holding up the building.

## If You Go

- **Best time:** Late afternoon, 5-7pm, for the golden hour
- **Where to eat:** Caffè Sicilia for granita that'll ruin all other granita forever
- **Insider tip:** Climb to the roof terrace of Chiesa di San Carlo for views that make the climb worth every step
- **Stay nearby:** Masseria Della Volpe, a restored farmhouse 10km outside town

The town empties after sunset. Most tourists rush back to Syracuse or Taormina. This is when Noto becomes itself again—a small town that just happens to be drop-dead gorgeous, where grandmothers still lean from those baroque balconies to gossip and the pizzeria stays open until the locals say it's time to close.`,
    coverImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200',
    tags: JSON.stringify(['baroque', 'architecture', 'southeast', 'unesco']),
    region: 'Southeast Sicily',
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
    excerpt: 'Modica\'s chocolate isn\'t smooth. It\'s not supposed to be. The sugar doesn\'t melt—it stays granular, crunchy, almost aggressive. This is chocolate the way the Aztecs made it, before the Spanish decided to "improve" it.',
    bodyMd: `Modica's chocolate isn't smooth. It's not supposed to be. The sugar doesn't melt—it stays granular, crunchy, almost aggressive. This is chocolate the way the Aztecs made it, before the Spanish decided to "improve" it.

## The Chocolate Houses

Every shop on Corso Umberto I sells it. Some have been making it the same way for five generations. Antica Dolceria Bonajuto, founded in 1880, still uses stone grinders and refuses to heat the chocolate above 40°C. The result is dark, intense, and completely unlike anything you buy in foil wrappers.

## Flavors Worth the Trip

They make it with everything: chili pepper (the traditional way), cinnamon, orange peel, pistachios, even salt. The chili version is the revelation—sweet, then hot, then sweet again. It shouldn't work, but it absolutely does.

> "We don't make chocolate. We preserve a tradition that should have died with the Spanish Empire. Somehow, we're still here." — Bonajuto chocolatier

## Beyond Chocolate

Modica itself is a hill town that climbs so steeply you'll question your life choices. But the baroque churches reward the climb. San Giorgio sits at the top like a crown, its 250 steps a pilgrimage locals make for Sunday mass without complaint.

## If You Go

- **Essential stop:** Antica Dolceria Bonajuto for the original recipe
- **Second opinion:** Caffè dell'Arte for modern interpretations
- **Pair with:** A walk through the cave houses of the Quartiere Rupestre
- **Time needed:** Half day minimum, but you'll want to stay longer`,
    coverImage: 'https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?w=1200',
    tags: JSON.stringify(['food', 'chocolate', 'baroque', 'southeast']),
    region: 'Southeast Sicily',
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
    excerpt: 'Stromboli erupts every 20 minutes. Not metaphorically. Literally. While you eat spaghetti alle vongole on a terrace overlooking the sea, the mountain behind you coughs up glowing rocks like clockwork.',
    bodyMd: `Stromboli erupts every 20 minutes. Not metaphorically. Literally. While you eat spaghetti alle vongole on a terrace overlooking the sea, the mountain behind you coughs up glowing rocks like clockwork.

## The Sciara del Fuoco

The "Stream of Fire" is what they call the scar down the volcano's north face where lava runs to the sea. At night, if you take the boat tour (and you should), you'll watch orange ribbons of molten rock slide down the black mountainside. It's the kind of sight that makes you feel very small and very lucky.

## Life in the Shadow

The island has maybe 500 year-round residents. They're used to it. The volcano is background noise, like traffic in a city. Tourists gasp at every rumble; locals keep setting tables.

> "When Stromboli is quiet, we worry. When it's active like this, we know it's healthy. A healthy volcano is a predictable volcano." — Island guide

## What to Do

Hike to the crater at sunset with a guide (required, and for good reason). The climb takes 3-4 hours. The view from the top—watching explosions from 100 meters away—is worth every vertical meter.

Then descend in the dark, headlamps bobbing, and fall into the first restaurant you find. Order the catch of the day. It was probably swimming this morning.

## If You Go

- **Get here:** Hydrofoil from Milazzo (2.5 hours) or helicopter from Sicily (15 minutes, very expensive)
- **Where to stay:** Pensione Sciara Residence for volcano views from bed
- **Eat at:** Il Canneto for seafood so fresh it's almost moving
- **Pack:** Good hiking boots, headlamp, layers (it's cold at 900m)`,
    coverImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
    tags: JSON.stringify(['volcano', 'islands', 'adventure', 'aeolian']),
    region: 'Aeolian Islands',
    minutes: 7,
    publishedAt: new Date('2025-01-25'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Sample tips for seeding
const sampleTips: NewTip[] = [
  {
    id: 'tip-1',
    slug: 'driving-sicily-survival',
    title: 'Driving in Sicily: A Survival Guide',
    excerpt: 'Turn signals are optional, lanes are suggestions, and the horn is a second language. Here\'s how to not die.',
    bodyMd: `## The Rules (Such As They Are)

1. **Lane markings are decorative**: Think of them as suggestions rather than laws of physics.
2. **The horn means everything**: "Hello," "Watch out," "I'm here," "You're too slow," "Nice car," "Move it." Context is everything.
3. **ZTL zones will bankrupt you**: Limited Traffic Zones are everywhere in historic centers. That €100 ticket will arrive 6 months later.

## Parking

- Blue lines: Pay and display
- White lines: Free (allegedly)
- Yellow lines: Don't even think about it
- No lines: Creative parking is acceptable

## Mountain Roads

The interior is where things get interesting. Roads built for donkeys, now used by Fiat Puntos doing 80km/h around blind hairpins. Stay right, honk before curves, pray to whatever gods you believe in.

## Gas Stations

Close for lunch. Close on Sundays. Close when you need them most. Fill up when you see one open.`,
    category: 'driving',
    icon: 'Car',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tip-2',
    slug: 'sicilian-coffee-rules',
    title: 'Coffee in Sicily: Unwritten Rules',
    excerpt: 'Cappuccino after noon is a mortal sin. Espresso is not a sipping drink. Here\'s how to not look like a tourist.',
    bodyMd: `## The Golden Rules

1. **No cappuccino after 11am**: Sicilians believe milk in the afternoon will kill you. They're serious.
2. **Espresso is a shot, not a session**: Drink it standing at the bar. Two sips maximum. Leave.
3. **Granita is breakfast**: Coffee granita with a brioche for dunking. This is not dessert. This is how you start the day.

## How to Order

- "Un caffè" = espresso (the default)
- "Caffè macchiato" = espresso with foam
- "Caffè corretto" = espresso with grappa (morning drink for old men)
- "Cappuccino" = only before noon, tourist

## Where to Go

- **Palermo**: Antico Caffè Spinnato
- **Catania**: Prestipino for granita
- **Taormina**: Bam Bar (granita to die for)
- **Syracuse**: Caffè Sicilia in Noto (worth the drive)

## Price Check

Espresso at the bar: €1-1.50
Espresso at a table: €3-4
Same coffee, different tax for sitting. This is Italy.`,
    category: 'coffee',
    icon: 'Coffee',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tip-3',
    slug: 'where-to-stay',
    title: 'Where to Stay: Agriturismo vs. Hotels',
    excerpt: 'Skip the beach resort. Find a farmhouse in the interior where dinner is whatever the nonna is cooking.',
    bodyMd: `## The Case for Agriturismo

Agriturismo means "farm stay." In practice, it means a working farm that rents rooms and feeds you food grown within shouting distance of your bed. This is not a boutique hotel. This is real.

### What You Get

- A room in a restored farmhouse
- Breakfast: fresh ricotta, homemade jam, yesterday's bread
- Dinner: Whatever's in season, cooked by someone who learned from their grandmother
- Wine: From the property, naturally
- Silence: No cars, no clubs, just cicadas

### What You Don't Get

- Room service
- A gym
- WiFi that works
- Other tourists

## Where to Look

- **Near Noto**: Masseria Della Volpe (citrus groves, swimming pool, perfect)
- **Near Modica**: Monterosso Almo area (cattle farms, quiet, cheap)
- **Etna slopes**: Terra & Fuoco (volcano views, volcanic wines)

## Hotels Worth Breaking the Rule For

- Monaci delle Terre Nere (Etna, if budget allows)
- Taormina: Skip the big hotels. Find a B&B in town.
- Palermo: Stay in the old town. Sounds sketchy, is actually great.

## Price Range

- Agriturismo: €60-120/night with half-board
- Mid-range hotel: €100-180/night
- Splurge hotel: €250+ (usually not worth it)`,
    category: 'where-to-stay',
    icon: 'Home',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tip-4',
    slug: 'local-survival-phrases',
    title: 'Local Survival: Beyond "Ciao"',
    excerpt: 'English works in tourist zones. Everywhere else, you\'ll need these phrases and a healthy dose of hand gestures.',
    bodyMd: `## Essential Sicilian Phrases

Sicilian is not Italian. It's older, weirder, and full of Arabic words. Old people in villages don't speak Italian—they speak Sicilian. Here's what you need:

### The Basics

- **Salutamu** (sah-loo-TAH-moo): Hello (informal)
- **Grazie assai** (GRAHT-see-eh ah-SAI): Thank you very much
- **Scusa** (SKOO-zah): Excuse me / Sorry
- **Picca picca** (PEE-kah PEE-kah): A little bit

### At the Market

- **Quantu costa?**: How much?
- **Troppu caru**: Too expensive (say it with a smile)
- **Va bene**: Okay, fine

### The Secret Weapon

**"Non parlo Siciliano"** (I don't speak Sicilian) with an apologetic shrug will get you more goodwill than trying to speak Italian in a village where Italian is the "foreign" language.

## Hand Gestures

- Fingers bunched, moving up and down: "What do you want?" (can be friendly or aggressive depending on face)
- Flat hand, tilted side to side: "So-so" or "What can you do?"
- Thumb tapping front teeth: Absolutely nothing (don't ask why)

## General Survival

- Shops close 1-4pm for lunch. Plan accordingly.
- Restaurants don't open for dinner until 8pm. Sicilians eat at 9pm.
- "Domani" (tomorrow) means "not today, maybe never."
- Everything takes longer than you think. Build in buffer time.

## Emergency Contacts

- 112: General emergency (English spoken)
- 118: Ambulance
- 113: Police
- Hotel front desk: Your actual emergency contact for everything`,
    category: 'local-survival',
    icon: 'Users',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seed() {
  console.log('🌱 Starting seed...');

  // Check if stories already exist
  const existingStories = await db.select().from(stories).limit(1);
  
  if (existingStories.length > 0) {
    console.log('⚠️  Database already has data. Skipping seed to avoid duplicates.');
    console.log('   To re-seed, manually delete data/editorial.db and run again.');
    return;
  }

  // Insert stories
  await db.insert(stories).values(sampleStories);
  console.log(`✓ Inserted ${sampleStories.length} stories`);

  // Insert tips
  await db.insert(tips).values(sampleTips);
  console.log(`✓ Inserted ${sampleTips.length} tips`);

  console.log('✅ Seed completed successfully!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
