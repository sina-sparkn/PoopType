export type FormLetter = "P" | "F";
export type OutlineLetter = "P" | "R";
export type ToneLetter = "T" | "L";
export type SheenLetter = "O" | "D";

export type PoopTypeCode = `${FormLetter}${OutlineLetter}${ToneLetter}${SheenLetter}`;

export type HumorType = "Melancholic" | "Sanguine" | "Phlegmatic" | "Choleric";

export interface BigFiveScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface PoopTypeProfile {
  code: PoopTypeCode;
  nickname: string;
  blurb: string;
  strengths: [string, string];
  flaws: [string, string];
  bestMatch: PoopTypeCode;
  worstMatch: PoopTypeCode;
  famousFor: string;
  humor: HumorType;
  humorNote: string;
  freudStage: "Anal-Retentive" | "Anal-Expulsive";
  freudNote: string;
  baseBigFive: BigFiveScores;
}

export interface AxisDefinition {
  axis: 1 | 2 | 3 | 4;
  name: string;
  measure: string;
  left: {
    letter: string;
    label: string;
    summary: string;
  };
  right: {
    letter: string;
    label: string;
    summary: string;
  };
}

export const AXIS_DEFINITIONS: AxisDefinition[] = [
  {
    axis: 1,
    name: "Form",
    measure: "Estimated Bristol Stool Scale type",
    left: {
      letter: "P",
      label: "Packed",
      summary:
        "Firm (Bristol 1–3). Playful nod to Freud's anal-retentive archetype and melancholic humor: orderly, stubborn, frugal, controlling.",
    },
    right: {
      letter: "F",
      label: "Free-flowing",
      summary:
        "Loose (Bristol 5–7). Playful nod to Freud's anal-expulsive archetype: impulsive, messy, generous, spontaneous. Bristol 4 breaks ties via seeded hash.",
    },
  },
  {
    axis: 2,
    name: "Outline",
    measure: "Sobel edge density",
    left: {
      letter: "P",
      label: "Precise",
      summary: "Smooth, defined contour lines. High faux-conscientiousness.",
    },
    right: {
      letter: "R",
      label: "Ragged",
      summary: "Irregular, fluffy perimeter. Chaotic, creative, high neuroticism.",
    },
  },
  {
    axis: 3,
    name: "Tone",
    measure: "Center-weighted CIE L* lightness",
    left: {
      letter: "T",
      label: "Toasted",
      summary: "Deep dark brown. Introspective, brooding melancholic energy.",
    },
    right: {
      letter: "L",
      label: "Light",
      summary: "Golden or light brown. Sunny choleric or sanguine energy.",
    },
  },
  {
    axis: 4,
    name: "Sheen",
    measure: "Specular highlight share",
    left: {
      letter: "O",
      label: "Oily",
      summary:
        "Glossy, 'moist' finish. Sanguine and phlegmatic link: smooth talker, adaptable.",
    },
    right: {
      letter: "D",
      label: "Dry",
      summary: "Matte finish. Choleric and melancholic link: dry wit, intense.",
    },
  },
];

export const POOP_TYPES: Record<PoopTypeCode, PoopTypeProfile> = {
  PPTO: {
    code: "PPTO",
    nickname: "The Vault Keeper",
    blurb:
      "Hoards, plans, and labels every drawer with archival devotion. Hard on the outside, glossy and diplomatic once someone earns the combination.",
    strengths: ["Color-coded contingency plans", "Smooth persuasion under tight deadlines"],
    flaws: ["Refuses to discard 2009 cable adapters", "Quietly audits friends' travel spreadsheets"],
    bestMatch: "FRLO",
    worstMatch: "FRTD",
    famousFor:
      "The fictional Municipal Archivist who laminated the town's backup snow-removal protocol in triplicate.",
    humor: "Melancholic",
    humorNote: "Melancholic structure cushioned by a sanguine sheen of social poise.",
    freudStage: "Anal-Retentive",
    freudNote: "Peak drawer-divider discipline; treats unlabeled jars as personal affronts.",
    baseBigFive: {
      openness: 42,
      conscientiousness: 93,
      extraversion: 46,
      agreeableness: 64,
      neuroticism: 38,
    },
  },
  PPTD: {
    code: "PPTD",
    nickname: "The Archival Monolith",
    blurb:
      "Carved from pure routine, stubbornness, and bone-dry editorial footnotes. Runs on strict timetables and treats unannounced spontaneity like a zoning violation.",
    strengths: ["Unshakable follow-through", "Razor-dry deadpan timing"],
    flaws: ["Suspicious of unmarked leftovers", "Views casual small talk as an operational leak"],
    bestMatch: "FPLO",
    worstMatch: "FRLD",
    famousFor:
      "The fictional Lighthouse Inspector who logged 14,000 consecutive sunsets in identical sepia fountain ink.",
    humor: "Melancholic",
    humorNote: "Classical dark, firm, dry melancholic composure down to the last decimal.",
    freudStage: "Anal-Retentive",
    freudNote: "Alphabetizes spice racks by botanical genus and keeps every receipt since 2016.",
    baseBigFive: {
      openness: 34,
      conscientiousness: 96,
      extraversion: 24,
      agreeableness: 41,
      neuroticism: 49,
    },
  },
  PPLO: {
    code: "PPLO",
    nickname: "The Golden Planner",
    blurb:
      "Sunny spreadsheets, smooth delegation, and mild stubbornness wrapped in approachable charm. Makes airtight control feel like an effortless Sunday brunch.",
    strengths: ["Friction-free group logistics", "Radiant, diplomatic conflict resolution"],
    flaws: ["Reformats shared itineraries at midnight", "Gentle obstinacy disguised as helpfulness"],
    bestMatch: "FRTO",
    worstMatch: "FRTD",
    famousFor:
      "The fictional Civic Gala Chairperson who scheduled a three-course potluck down to the garnish intervals.",
    humor: "Sanguine",
    humorNote: "Warm sanguine gloss steadied by neat, predictable structural boundaries.",
    freudStage: "Anal-Retentive",
    freudNote: "Polite retentiveness: delegates smoothly as long as everyone uses the shared template.",
    baseBigFive: {
      openness: 56,
      conscientiousness: 88,
      extraversion: 74,
      agreeableness: 79,
      neuroticism: 29,
    },
  },
  PPLD: {
    code: "PPLD",
    nickname: "The Dry Accountant",
    blurb:
      "Brightly lit minimalism paired with matte precision and zero wasted syllables. Balances every ledger before breakfast and politely requests itemized proof.",
    strengths: ["Impeccable budget stewardship", "Crisp, distraction-free clarity"],
    flaws: ["Splits shared appetizers to the penny", "Treats whimsy as an unapproved line item"],
    bestMatch: "FRTO",
    worstMatch: "FRLO",
    famousFor:
      "The fictional Clocktower Treasurer who audited the square's pigeons for unauthorized breadcrumb subsidies.",
    humor: "Choleric",
    humorNote: "Brisk, light, matte choleric focus—sharp edges, warm glare, zero fluff.",
    freudStage: "Anal-Retentive",
    freudNote: "Frugal to the bone; reuses gift tissue paper with museum-grade folding creases.",
    baseBigFive: {
      openness: 38,
      conscientiousness: 91,
      extraversion: 44,
      agreeableness: 48,
      neuroticism: 42,
    },
  },
  PRTO: {
    code: "PRTO",
    nickname: "The Velvet Strategist",
    blurb:
      "Packed with private convictions yet fringed with brooding, eccentric creative flourishes. Smooths over midnight overthinking with disarming polish and good snacks.",
    strengths: ["Inventive lateral problem-solving", "Cool composure during absurd plot twists"],
    flaws: ["Over-engineers simple weekend errands", "Collects obscure hobbies without retiring old ones"],
    bestMatch: "FPLD",
    worstMatch: "FPLO",
    famousFor:
      "The fictional Antiquarian Chess Master who drafted a 40-page opening gambit for rainy park matches.",
    humor: "Phlegmatic",
    humorNote: "Brooding dark tones softened by phlegmatic adaptability and velvet polish.",
    freudStage: "Anal-Retentive",
    freudNote: "Retains intricate mental maps of grudges, recipes, and rare vinyl pressings.",
    baseBigFive: {
      openness: 82,
      conscientiousness: 63,
      extraversion: 48,
      agreeableness: 66,
      neuroticism: 67,
    },
  },
  PRTD: {
    code: "PRTD",
    nickname: "The Crumbly Stoic",
    blurb:
      "Dense, introspective, and gloriously jagged around the edges with a bone-dry sense of humor. Guards private routines behind dramatic sighs and well-thumbed paperbacks.",
    strengths: ["Deep, uninterrupted concentration", "Unforgettable deadpan commentary"],
    flaws: ["Refuses to ask for directions on principle", "Broods over mismatched typography"],
    bestMatch: "FPLO",
    worstMatch: "FRLO",
    famousFor:
      "The fictional Alpine Botanist who penned a 600-page monograph defending lichen from 'modern haste'.",
    humor: "Melancholic",
    humorNote: "Double-distilled melancholic temperament—dark, matte, and fiercely philosophical.",
    freudStage: "Anal-Retentive",
    freudNote: "Stubbornly independent; insists on packing the car trunk personally.",
    baseBigFive: {
      openness: 74,
      conscientiousness: 58,
      extraversion: 21,
      agreeableness: 39,
      neuroticism: 78,
    },
  },
  PRLO: {
    code: "PRLO",
    nickname: "The Sunlit Eccentric",
    blurb:
      "Firmly devoted to idiosyncratic personal systems, yet fuzzy-edged, warm, and delightfully adaptable. Turns strict to-do lists into colorful watercolor collages.",
    strengths: ["Playful creative synthesis", "Warm, disarming social flexibility"],
    flaws: ["Organizes books by emotional temperature", "Launches five craft projects before noon"],
    bestMatch: "FPTD",
    worstMatch: "PPTD",
    famousFor:
      "The fictional Seaside Toymaker who cataloged driftwood according to its 'conversational posture'.",
    humor: "Sanguine",
    humorNote: "Sunny, glossy sanguine cheerfulness tethered to charmingly stubborn rituals.",
    freudStage: "Anal-Retentive",
    freudNote: "Hoards vintage buttons, ticket stubs, and unusually smooth pebbles with pride.",
    baseBigFive: {
      openness: 89,
      conscientiousness: 54,
      extraversion: 76,
      agreeableness: 81,
      neuroticism: 59,
    },
  },
  PRLD: {
    code: "PRLD",
    nickname: "The Chalkboard Tactician",
    blurb:
      "Tightly wound, brightly caffeinated, and bristling with rough-draft schematics. Combines stubborn principles with a chalk-dust storm of rapid-fire brainstorms.",
    strengths: ["Relentless analytical curiosity", "Quick, dry conceptual humor"],
    flaws: ["Rewrites working plans just to optimize them", "Debates board-game rules for forty minutes"],
    bestMatch: "FPTO",
    worstMatch: "PPTO",
    famousFor:
      "The fictional Observatory Clerk who rearranged the breakroom chairs using orbital mechanics.",
    humor: "Choleric",
    humorNote: "Light, matte, high-voltage choleric energy fueled by stubborn inventiveness.",
    freudStage: "Anal-Retentive",
    freudNote: "Controlling over methods while delightfully chaotic over desk surfaces.",
    baseBigFive: {
      openness: 84,
      conscientiousness: 61,
      extraversion: 52,
      agreeableness: 44,
      neuroticism: 74,
    },
  },
  FPTO: {
    code: "FPTO",
    nickname: "The Smooth Improviser",
    blurb:
      "Flows effortlessly through unscheduled evenings while maintaining an inexplicably sleek exterior. Generous with time, advice, and convincing last-minute plans.",
    strengths: ["Graceful poise in sudden chaos", "Effortlessly generous host"],
    flaws: ["Treats deadlines as poetic suggestions", "Accepts three overlapping dinner invitations"],
    bestMatch: "PRLD",
    worstMatch: "PPTD",
    famousFor:
      "The fictional Harbor Ferry Captain who turned a missed pier into an acclaimed twilight jazz cruise.",
    humor: "Phlegmatic",
    humorNote: "Cool, glossy phlegmatic ease paired with dark, unhurried composure.",
    freudStage: "Anal-Expulsive",
    freudNote: "Spontaneous and lavishly generous; happily lends out their favorite jacket forever.",
    baseBigFive: {
      openness: 71,
      conscientiousness: 59,
      extraversion: 68,
      agreeableness: 77,
      neuroticism: 31,
    },
  },
  FPTD: {
    code: "FPTD",
    nickname: "The Espresso Sprinter",
    blurb:
      "Moves fast, speaks bluntly, and leaves crisp, dark trails of decisive action. Impulsive enough to board a midnight train, precise enough to pack one carry-on.",
    strengths: ["Zero-drag decisive momentum", "Sharp, uncluttered judgment"],
    flaws: ["Skips assembly manuals out of pride", "Leaves ambitious projects at 93% done"],
    bestMatch: "PRLO",
    worstMatch: "PPLO",
    famousFor:
      "The fictional Night-Train Courier who delivered rare manuscripts across four borders without consulting a timetable.",
    humor: "Choleric",
    humorNote: "Brisk, matte intensity with dark roast focus and impatient forward drive.",
    freudStage: "Anal-Expulsive",
    freudNote: "Impulsive mover who values speed and generosity over careful filing cabinets.",
    baseBigFive: {
      openness: 64,
      conscientiousness: 62,
      extraversion: 57,
      agreeableness: 46,
      neuroticism: 47,
    },
  },
  FPLO: {
    code: "FPLO",
    nickname: "The Buttered Diplomat",
    blurb:
      "Breezy, golden, and gliding through social rooms with immaculate contours and generous tabs. Convinced every logistical hiccup improves with pastries and a detour.",
    strengths: ["Effortless crowd-pleasing warmth", "Generous, friction-free collaboration"],
    flaws: ["Misplaces house keys three times a week", "Says yes before opening the calendar"],
    bestMatch: "PPTD",
    worstMatch: "PRTO",
    famousFor:
      "The fictional Grand Hotel Concierge who solved a double-booked ballroom by inventing an annual 'Fusion Banquet'.",
    humor: "Sanguine",
    humorNote: "Textbook sanguine temperament: warm, soft, glossy, and impossibly sociable.",
    freudStage: "Anal-Expulsive",
    freudNote: "Spontaneous, buoyant, and quick to pick up the table's coffee bill.",
    baseBigFive: {
      openness: 69,
      conscientiousness: 55,
      extraversion: 88,
      agreeableness: 86,
      neuroticism: 24,
    },
  },
  FPLD: {
    code: "FPLD",
    nickname: "The Brisk Minimalist",
    blurb:
      "Fast-moving, sunny, and briskly matte with zero attachment to clutter or sentimental storage bins. Donates spare chairs on a whim and travels with a single tote.",
    strengths: ["Clutter-free decisiveness", "Refreshing candor without melodrama"],
    flaws: ["Discards warranty booklets immediately", "Sprints past scenic viewpoints"],
    bestMatch: "PRTO",
    worstMatch: "PPTO",
    famousFor:
      "The fictional Desert Architect who designed an entire villa around one folding stool and a skylight.",
    humor: "Choleric",
    humorNote: "Light, quick, dry choleric briskness—direct, breezy, and allergic to bloat.",
    freudStage: "Anal-Expulsive",
    freudNote: "Zero hoarding instinct; gives away books the moment the final chapter ends.",
    baseBigFive: {
      openness: 61,
      conscientiousness: 64,
      extraversion: 66,
      agreeableness: 54,
      neuroticism: 36,
    },
  },
  FRTO: {
    code: "FRTO",
    nickname: "The Midnight Alchemist",
    blurb:
      "Loose, nocturnal, glossy, and brimming with sprawling theories shared over late-night noodles. Melts rigid schedules into unforgettable artistic detours.",
    strengths: ["Magnetic late-night storytelling", "Fearless creative experimentation"],
    flaws: ["Starts rearranging furniture at 1:45 AM", "Treats paper receipts as abstract confetti"],
    bestMatch: "PPLO",
    worstMatch: "PPLD",
    famousFor:
      "The fictional Midnight Broth-Cart Philosopher who traded bowls of soup for unsolved neighborhood riddles.",
    humor: "Phlegmatic",
    humorNote: "Soft, glossy phlegmatic flow steeped in brooding midnight curiosity.",
    freudStage: "Anal-Expulsive",
    freudNote: "Glamorously disorganized; overflows with generosity and unfinished sketchbooks.",
    baseBigFive: {
      openness: 94,
      conscientiousness: 29,
      extraversion: 63,
      agreeableness: 74,
      neuroticism: 68,
    },
  },
  FRTD: {
    code: "FRTD",
    nickname: "The Espresso Hurricane",
    blurb:
      "Unfiltered intensity wrapped in dark, ragged turbulence and bone-dry sarcasm. Generous in a crisis, yet profoundly allergic to any invite sent more than an hour early.",
    strengths: ["Electric creative candor", "Fierce loyalty when plans implode"],
    flaws: ["Keeps forty-seven browser tabs open", "Turns routine errands into dramatic epics"],
    bestMatch: "PPLD",
    worstMatch: "PPTO",
    famousFor:
      "The fictional Underground Zine Printer who issued a 90-page manifesto criticizing weak stapler springs.",
    humor: "Melancholic",
    humorNote: "Dark, dry, turbulent vigor—melancholic depth with chaotic kinetic scatter.",
    freudStage: "Anal-Expulsive",
    freudNote: "Rebellious expulsive spark; breaks rules primarily to see what happens next.",
    baseBigFive: {
      openness: 88,
      conscientiousness: 24,
      extraversion: 58,
      agreeableness: 42,
      neuroticism: 86,
    },
  },
  FRLO: {
    code: "FRLO",
    nickname: "The Liquid Sunshine",
    blurb:
      "Radiant, sprawling, and effortlessly buoyant—arriving twenty minutes late with warm pastries and somehow winning the room. Spreads warmth, generosity, and mild logistical panic.",
    strengths: ["Infectious optimism and charm", "Boundless spontaneous generosity"],
    flaws: ["Treating departure times as rough folklore", "Creating group chats for solo errands"],
    bestMatch: "PPTO",
    worstMatch: "PRTD",
    famousFor:
      "The fictional Festival Parade Marshal who joyfully detoured a brass band straight into a cul-de-sac picnic.",
    humor: "Sanguine",
    humorNote: "Pure radiant sanguine overflow—soft, warm, glossy, and irrepressibly lively.",
    freudStage: "Anal-Expulsive",
    freudNote: "Textbook impulsive generosity; shares snacks, secrets, and playlists within five minutes.",
    baseBigFive: {
      openness: 91,
      conscientiousness: 26,
      extraversion: 94,
      agreeableness: 88,
      neuroticism: 54,
    },
  },
  FRLD: {
    code: "FRLD",
    nickname: "The Confetti Philosopher",
    blurb:
      "Lighthearted, fluffy-edged, dry-witted, and cheerfully immune to rigid itineraries. Scatters brilliant observations across five notebooks and misplaces four by Friday.",
    strengths: ["Sparkling off-the-cuff wit", "Unfiltered openness to weird ideas"],
    flaws: ["Never finishes a single mug of tea", "Forgets the purpose of entering a room"],
    bestMatch: "PPTD",
    worstMatch: "PPLO",
    famousFor:
      "The fictional Hot-Air Balloon Cartographer who mapped cloud silhouettes instead of municipal roads.",
    humor: "Choleric",
    humorNote: "Bright, dry, breezy choleric sparks scattering in every direction at once.",
    freudStage: "Anal-Expulsive",
    freudNote: "Playfully messy, endlessly generous, and baffled by color-coded filing folders.",
    baseBigFive: {
      openness: 92,
      conscientiousness: 22,
      extraversion: 79,
      agreeableness: 63,
      neuroticism: 71,
    },
  },
};

export const ALL_POOP_CODES = Object.keys(POOP_TYPES) as PoopTypeCode[];

export function isValidPoopCode(value: string): value is PoopTypeCode {
  return value.toUpperCase() in POOP_TYPES;
}

export const BRISTOL_DESCRIPTIONS: Record<
  number,
  { name: string; shortLabel: string; traitNote: string }
> = {
  1: {
    name: "Type 1",
    shortLabel: "Separate hard pellets",
    traitNote: "Ultra-packed; maximum compartmentalization.",
  },
  2: {
    name: "Type 2",
    shortLabel: "Lumpy & sausage-shaped",
    traitNote: "Firm committee of tightly bound opinions.",
  },
  3: {
    name: "Type 3",
    shortLabel: "Firm with surface cracks",
    traitNote: "Structured exterior with thoughtful fault lines.",
  },
  4: {
    name: "Type 4",
    shortLabel: "Smooth & snake-like",
    traitNote: "The textbook ideal; Form tie broken via seeded hash.",
  },
  5: {
    name: "Type 5",
    shortLabel: "Soft blobs, clear-cut edges",
    traitNote: "Relaxed modularity at the loose end of normal.",
  },
  6: {
    name: "Type 6",
    shortLabel: "Fluffy pieces, ragged edges",
    traitNote: "Free-flowing improvisation with expressive margins.",
  },
  7: {
    name: "Type 7",
    shortLabel: "Entirely liquid, no solid pieces",
    traitNote: "Maximum velocity; zero commitment to geometry.",
  },
};
