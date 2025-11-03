// Gesture management library
// Fallback to in-memory data

import type { Gesture } from '@/db/schema';

// In-memory Sicilian gestures data
const gesturesData: Gesture[] = [
  {
    id: 'gesture-1',
    slug: 'che-vuoi',
    title: 'Ma che vuoi?',
    meaningShort: 'What do you want / Are you serious?',
    descriptionMd: '- Fingers bunched together, hand moves up and down\n- Common gesture of disbelief or annoyance\n- Can be playful or serious depending on context',
    doDont: JSON.stringify({
      do: ['Use jokingly with friends', 'Use to tease lightly', 'Pair with raised eyebrows'],
      dont: ['Point directly at strangers', 'Use with authority figures', 'Overuse in formal settings']
    }),
    imageUrl: '/images/gestures/che-vuoi.png',
    tags: JSON.stringify(['annoyance', 'question', 'common']),
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'gesture-2',
    slug: 'delicious',
    title: 'Buonissimo!',
    meaningShort: 'Delicious!',
    descriptionMd: '- Twist index finger into cheek while smiling\n- Universal sign of approval for great food\n- One of the most friendly and expressive gestures',
    doDont: JSON.stringify({
      do: ['Use after truly great food', 'Pair with a smile', 'Use with restaurant staff'],
      dont: ['Overdo it sarcastically', 'Use for mediocre food', 'Force it if food was bad']
    }),
    imageUrl: '/images/gestures/buonissimo.png',
    tags: JSON.stringify(['food', 'praise', 'common']),
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'gesture-3',
    slug: 'perfect',
    title: 'Perfetto',
    meaningShort: 'Perfect / Excellent',
    descriptionMd: '- Tips of thumb and index finger touch, forming a circle\n- Hand may move slightly up and down\n- Universal sign of approval',
    doDont: JSON.stringify({
      do: ['Use to confirm understanding', 'Show appreciation', 'Acknowledge good service'],
      dont: ['Use sarcastically', 'Overuse for minor things']
    }),
    imageUrl: '/images/gestures/perfetto.png',
    tags: JSON.stringify(['praise', 'agreement', 'common']),
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'gesture-4',
    slug: 'small-amount',
    title: 'Un pochino',
    meaningShort: 'A little bit / Just a small amount',
    descriptionMd: '- Thumb and index finger held close together\n- Often used when ordering food or drinks\n- Can indicate "not too much"',
    doDont: JSON.stringify({
      do: ['Use when ordering wine', 'Indicate portion size', 'Show modesty'],
      dont: ['Use for important quantities', 'Confuse with money gesture']
    }),
    imageUrl: '/images/gestures/pochino.png',
    tags: JSON.stringify(['quantity', 'food', 'practical']),
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'gesture-5',
    slug: 'enough',
    title: 'Basta!',
    meaningShort: 'Enough! / Stop!',
    descriptionMd: '- Hand held up, palm facing outward\n- Can be firm or gentle depending on context\n- Clear boundary-setting gesture',
    doDont: JSON.stringify({
      do: ['Use to refuse more food politely', 'Set boundaries clearly', 'Stop unwanted behavior'],
      dont: ['Use aggressively', 'Confuse with waving hello', 'Overreact to minor things']
    }),
    imageUrl: '/images/gestures/basta.png',
    tags: JSON.stringify(['refusal', 'boundary', 'practical']),
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'gesture-6',
    slug: 'go-away',
    title: 'Vattene!',
    meaningShort: 'Go away / Leave me alone',
    descriptionMd: '- Hand flicks outward from under chin\n- Can be playful or aggressive\n- Dismissive gesture',
    doDont: JSON.stringify({
      do: ['Use playfully with friends', 'Shoo away persistent vendors'],
      dont: ['Use in formal settings', 'Direct at service staff', 'Use without understanding context']
    }),
    imageUrl: '/images/gestures/vattene.png',
    tags: JSON.stringify(['dismissal', 'emotion', 'casual']),
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'gesture-7',
    slug: 'silence',
    title: 'Silenzio',
    meaningShort: 'Be quiet / Silence',
    descriptionMd: '- Index finger placed vertically over lips\n- Universal "shh" gesture\n- Can be gentle or commanding',
    doDont: JSON.stringify({
      do: ['Use to request quiet', 'Signal secrecy', 'Calm noisy situations'],
      dont: ['Shush elders', 'Use rudely', 'Overuse in churches (just be quiet)']
    }),
    imageUrl: '/images/gestures/silenzio.png',
    tags: JSON.stringify(['request', 'practical', 'common']),
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'gesture-8',
    slug: 'i-dont-know',
    title: 'Boh!',
    meaningShort: "I don't know / Who knows?",
    descriptionMd: '- Shrug shoulders, hands turned up, mouth turned down\n- Quintessential expression of uncertainty\n- Often accompanied by "Boh!"',
    doDont: JSON.stringify({
      do: ['Admit when you don\'t know', 'Express uncertainty', 'Show humility'],
      dont: ['Use when you should know', 'Overuse to avoid responsibility', 'Use in professional settings']
    }),
    imageUrl: '/images/gestures/boh.png',
    tags: JSON.stringify(['uncertainty', 'common', 'emotion']),
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'gesture-9',
    slug: 'phone-me',
    title: 'Chiamami',
    meaningShort: 'Call me / Phone me later',
    descriptionMd: '- Thumb and pinky finger extended, other fingers folded\n- Hand held to ear like old telephone\n- Modern version of staying in touch',
    doDont: JSON.stringify({
      do: ['Use to say goodbye', 'Promise to call', 'Keep in touch'],
      dont: ['Use during important conversations', 'Confuse with surfing gesture']
    }),
    imageUrl: '/images/gestures/chiamami.png',
    tags: JSON.stringify(['communication', 'practical', 'modern']),
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'gesture-10',
    slug: 'lets-go',
    title: 'Andiamo!',
    meaningShort: "Let's go / Come on",
    descriptionMd: '- Hand waves toward yourself, beckoning motion\n- Can be urgent or casual\n- Inviting someone to come along',
    doDont: JSON.stringify({
      do: ['Invite someone to join', 'Speed up the group', 'Show enthusiasm'],
      dont: ['Use to summon strangers', 'Confuse with "go away" gesture', 'Be too aggressive']
    }),
    imageUrl: '/images/gestures/andiamo.png',
    tags: JSON.stringify(['invitation', 'movement', 'common']),
    region: 'sicily',
    updatedAt: new Date(),
  },
];

// Helper function to parse JSON fields
export function parseDoDont(json: string): { do: string[]; dont: string[] } {
  try {
    return JSON.parse(json);
  } catch {
    return { do: [], dont: [] };
  }
}

export function parseTags(json: string): string[] {
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

// Data access functions with region filtering
export async function getGestures(options: { region?: string } = {}): Promise<Gesture[]> {
  const { region = 'sicily' } = options;
  // TODO: Replace with database query when DB is set up
  return gesturesData.filter((g) => g.region === region);
}

export async function getGestureBySlug(slug: string, options: { region?: string } = {}): Promise<Gesture | null> {
  const { region = 'sicily' } = options;
  // TODO: Replace with database query
  const gesture = gesturesData.find((g) => g.slug === slug && g.region === region);
  return gesture || null;
}

export async function getGesturesByTag(tag: string, options: { region?: string } = {}): Promise<Gesture[]> {
  const { region = 'sicily' } = options;
  // TODO: Replace with database query
  return gesturesData.filter((g) => {
    const tags = parseTags(g.tags);
    return g.region === region && tags.includes(tag);
  });
}

export function getAllTags(gestures: Gesture[]): string[] {
  const tagSet = new Set<string>();
  gestures.forEach((g) => {
    const tags = parseTags(g.tags);
    tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
