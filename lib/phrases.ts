// Phrase management library
// Fallback to in-memory phrasebook data

import type { Phrase } from '@/db/schema';

// In-memory Sicilian phrasebook data
const phrasesData: Phrase[] = [
  // Bar & Café
  {
    id: 'phrase-1',
    slug: 'coffee-please',
    category: 'bar-cafe',
    english: 'A coffee, please',
    italian: 'Un caffè, grazie',
    italianPhonetic: '/oon kah-FEH GRA-tsye/',
    sicilian: 'Nu cafè, grazzii',
    sicilianPhonetic: '/noo kah-FEH GRAT-tsee/',
    notes: 'Default is espresso',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-2',
    slug: 'water-please',
    category: 'bar-cafe',
    english: 'A glass of water, please',
    italian: 'Un bicchiere d\'acqua, per favore',
    italianPhonetic: '/oon bee-KYEH-reh DAH-kwah pehr fah-VOH-reh/',
    sicilian: 'Nu bicchieri d\'acqua, pi piaciri',
    sicilianPhonetic: '/noo bee-KYEH-ree DAH-kwah pee pya-CHEE-ree/',
    notes: 'Specify "naturale" (still) or "frizzante" (sparkling)',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-3',
    slug: 'check-please',
    category: 'bar-cafe',
    english: 'The check, please',
    italian: 'Il conto, per favore',
    italianPhonetic: '/eel KON-toh pehr fah-VOH-reh/',
    sicilian: 'U cuntu, pi piaciri',
    sicilianPhonetic: '/oo KOON-too pee pya-CHEE-ree/',
    notes: '',
    region: 'sicily',
    updatedAt: new Date(),
  },
  
  // Restaurant
  {
    id: 'phrase-4',
    slug: 'table-for-two',
    category: 'restaurant',
    english: 'A table for two, please',
    italian: 'Un tavolo per due, per favore',
    italianPhonetic: '/oon TAH-voh-loh pehr DOO-eh pehr fah-VOH-reh/',
    sicilian: 'Na tavula pi dui, pi piaciri',
    sicilianPhonetic: '/nah TAH-voo-lah pee DOO-ee pee pya-CHEE-ree/',
    notes: '',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-5',
    slug: 'menu-please',
    category: 'restaurant',
    english: 'The menu, please',
    italian: 'Il menù, per favore',
    italianPhonetic: '/eel meh-NOO pehr fah-VOH-reh/',
    sicilian: 'U menu, pi piaciri',
    sicilianPhonetic: '/oo meh-NOO pee pya-CHEE-ree/',
    notes: '',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-6',
    slug: 'house-wine',
    category: 'restaurant',
    english: 'House wine, please',
    italian: 'Vino della casa, per favore',
    italianPhonetic: '/VEE-noh DEL-lah KAH-sah pehr fah-VOH-reh/',
    sicilian: 'Vinu dâ casa, pi piaciri',
    sicilianPhonetic: '/VEE-noo dah KAH-sah pee pya-CHEE-ree/',
    notes: 'Specify "rosso" (red) or "bianco" (white)',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-7',
    slug: 'delicious',
    category: 'restaurant',
    english: 'It was delicious',
    italian: 'Era buonissimo',
    italianPhonetic: '/EH-rah bwoh-NEES-see-moh/',
    sicilian: 'Era bbuonissimu',
    sicilianPhonetic: '/EH-rah bbwoh-NEES-see-moo/',
    notes: 'Pair with the cheek-twist gesture',
    region: 'sicily',
    updatedAt: new Date(),
  },
  
  // Driving
  {
    id: 'phrase-8',
    slug: 'turn-left',
    category: 'driving',
    english: 'Turn left / right',
    italian: 'Gira a sinistra / a destra',
    italianPhonetic: '/JEE-rah a see-NEES-trah / a DEH-stra/',
    sicilian: 'Gira a manca / a destra',
    sicilianPhonetic: '/JEE-rah a MAN-ka / a DEH-stra/',
    notes: '',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-9',
    slug: 'gas-station',
    category: 'driving',
    english: 'Where is the gas station?',
    italian: 'Dov\'è il distributore?',
    italianPhonetic: '/doh-VEH eel dee-stree-boo-TOH-reh/',
    sicilian: 'Unni è u distributuri?',
    sicilianPhonetic: '/OON-nee eh oo dee-stree-boo-TOO-ree/',
    notes: '',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-10',
    slug: 'parking',
    category: 'driving',
    english: 'Where can I park?',
    italian: 'Dove posso parcheggiare?',
    italianPhonetic: '/DOH-veh POHS-soh par-keh-JAH-reh/',
    sicilian: 'Unni pozzu parchijari?',
    sicilianPhonetic: '/OON-nee POHTS-soo par-kee-YAH-ree/',
    notes: 'Look for "P" signs or ask locally',
    region: 'sicily',
    updatedAt: new Date(),
  },
  
  // Courtesy
  {
    id: 'phrase-11',
    slug: 'hello',
    category: 'courtesy',
    english: 'Hello',
    italian: 'Ciao / Salve',
    italianPhonetic: '/CHOW / SAHL-veh/',
    sicilian: 'Salutamu / Cià',
    sicilianPhonetic: '/sah-loo-TAH-moo / CHAH/',
    notes: 'Ciao is informal, Salve is neutral',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-12',
    slug: 'thank-you',
    category: 'courtesy',
    english: 'Thank you',
    italian: 'Grazie',
    italianPhonetic: '/GRA-tsye/',
    sicilian: 'Grazzii',
    sicilianPhonetic: '/GRAT-tsee/',
    notes: '',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-13',
    slug: 'thank-you-very-much',
    category: 'courtesy',
    english: 'Thank you very much',
    italian: 'Grazie mille',
    italianPhonetic: '/GRA-tsye MEEL-leh/',
    sicilian: 'Grazzii assai',
    sicilianPhonetic: '/GRAT-tsee ah-SAI/',
    notes: 'More emphatic than just "grazie"',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-14',
    slug: 'excuse-me',
    category: 'courtesy',
    english: 'Excuse me',
    italian: 'Scusi / Mi scusi',
    italianPhonetic: '/SKOO-zee / mee SKOO-zee/',
    sicilian: 'Scusatimi',
    sicilianPhonetic: '/skoo-sah-TEE-mee/',
    notes: 'Use to get attention or apologize',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-15',
    slug: 'please',
    category: 'courtesy',
    english: 'Please',
    italian: 'Per favore',
    italianPhonetic: '/pehr fah-VOH-reh/',
    sicilian: 'Pi piaciri',
    sicilianPhonetic: '/pee pya-CHEE-ree/',
    notes: '',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-16',
    slug: 'good-morning',
    category: 'courtesy',
    english: 'Good morning',
    italian: 'Buongiorno',
    italianPhonetic: '/bwohn-JOHR-noh/',
    sicilian: 'Bongiurnu',
    sicilianPhonetic: '/bohn-JOOR-noo/',
    notes: 'Use until early afternoon',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-17',
    slug: 'good-evening',
    category: 'courtesy',
    english: 'Good evening',
    italian: 'Buonasera',
    italianPhonetic: '/bwoh-nah-SEH-rah/',
    sicilian: 'Bonasira',
    sicilianPhonetic: '/boh-nah-SEE-rah/',
    notes: 'Use from late afternoon onward',
    region: 'sicily',
    updatedAt: new Date(),
  },
  
  // Emergency
  {
    id: 'phrase-18',
    slug: 'help',
    category: 'emergency',
    english: 'Help!',
    italian: 'Aiuto!',
    italianPhonetic: '/ah-YOO-toh/',
    sicilian: 'Ajutu!',
    sicilianPhonetic: '/ah-YOO-too/',
    notes: '',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-19',
    slug: 'doctor',
    category: 'emergency',
    english: 'I need a doctor',
    italian: 'Ho bisogno di un dottore',
    italianPhonetic: '/oh bee-ZOHN-yoh dee oon doh-TOH-reh/',
    sicilian: 'M\'abbisogna nu dutturi',
    sicilianPhonetic: '/mah-bee-ZOHN-yah noo doo-TOO-ree/',
    notes: 'Call 118 for medical emergency',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-20',
    slug: 'pharmacy',
    category: 'emergency',
    english: 'Where is the pharmacy?',
    italian: 'Dov\'è la farmacia?',
    italianPhonetic: '/doh-VEH lah far-mah-CHEE-ah/',
    sicilian: 'Unni è a farmacìa?',
    sicilianPhonetic: '/OON-nee eh ah far-mah-CHEE-ah/',
    notes: 'Look for green cross sign',
    region: 'sicily',
    updatedAt: new Date(),
  },
  
  // Fun & Local
  {
    id: 'phrase-21',
    slug: 'little-bit',
    category: 'fun',
    english: 'A little bit',
    italian: 'Un pochino',
    italianPhonetic: '/oon poh-KEE-noh/',
    sicilian: 'Picca picca',
    sicilianPhonetic: '/PEE-kah PEE-kah/',
    notes: 'Often with thumb-finger gesture',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-22',
    slug: 'no-problem',
    category: 'fun',
    english: 'No problem',
    italian: 'Nessun problema',
    italianPhonetic: '/ness-SOON proh-BLEH-mah/',
    sicilian: 'Nuddu prublema',
    sicilianPhonetic: '/NOOD-doo proo-BLEH-mah/',
    notes: '',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-23',
    slug: 'maybe-tomorrow',
    category: 'fun',
    english: 'Maybe tomorrow',
    italian: 'Forse domani',
    italianPhonetic: '/FOHR-seh doh-MAH-nee/',
    sicilian: 'Forsi dumani',
    sicilianPhonetic: '/FOHR-see doo-MAH-nee/',
    notes: 'Often means "probably never"',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-24',
    slug: 'beautiful',
    category: 'fun',
    english: 'Beautiful!',
    italian: 'Bellissimo!',
    italianPhonetic: '/bell-LEES-see-moh/',
    sicilian: 'Beddu assai!',
    sicilianPhonetic: '/BEDD-doo ah-SAI/',
    notes: 'General exclamation of admiration',
    region: 'sicily',
    updatedAt: new Date(),
  },
  {
    id: 'phrase-25',
    slug: 'i-dont-know',
    category: 'fun',
    english: "I don't know",
    italian: 'Non lo so / Boh',
    italianPhonetic: '/nohn loh SOH / BOH/',
    sicilian: 'Un sacciu / Boh',
    sicilianPhonetic: '/oon SAHCH-choo / BOH/',
    notes: 'Pair with shoulder shrug gesture',
    region: 'sicily',
    updatedAt: new Date(),
  },
];

// Data access functions with region filtering
export async function getPhrases(options: { region?: string } = {}): Promise<Phrase[]> {
  const { region = 'sicily' } = options;
  // TODO: Replace with database query when DB is set up
  return phrasesData.filter((p) => p.region === region);
}

export async function getPhraseBySlug(slug: string, options: { region?: string } = {}): Promise<Phrase | null> {
  const { region = 'sicily' } = options;
  // TODO: Replace with database query
  const phrase = phrasesData.find((p) => p.slug === slug && p.region === region);
  return phrase || null;
}

export async function getPhrasesByCategory(category: string, options: { region?: string } = {}): Promise<Phrase[]> {
  const { region = 'sicily' } = options;
  // TODO: Replace with database query
  return phrasesData.filter((p) => p.category === category && p.region === region);
}

export function getAllCategories(phrases: Phrase[]): string[] {
  const categories = Array.from(new Set(phrases.map((p) => p.category)));
  return categories.sort();
}

export function searchPhrases(phrases: Phrase[], query: string): Phrase[] {
  const lowerQuery = query.toLowerCase();
  return phrases.filter((p) => 
    p.english.toLowerCase().includes(lowerQuery) ||
    p.italian.toLowerCase().includes(lowerQuery) ||
    (p.sicilian && p.sicilian.toLowerCase().includes(lowerQuery)) ||
    p.category.toLowerCase().includes(lowerQuery)
  );
}

// Category display names
export const categoryNames: Record<string, string> = {
  'bar-cafe': 'Bar & Café',
  'restaurant': 'Restaurant',
  'driving': 'Driving',
  'courtesy': 'Courtesy',
  'emergency': 'Emergency',
  'fun': 'Fun & Local'
};
