import { PoopTypeCode } from "./types-data";

export const PALETTE = {
  bubblegum: "#FF7AC6",
  sunshine: "#FFD93D",
  mint: "#6BE3B5",
  sky: "#5CC8FF",
  grape: "#9B6BFF",
  grapeSoft: "#B997FF",
  tangerine: "#FF9F43",
  poopBrown: "#8B5A2B",
  cream: "#FFF6E5",
  ink: "#1B1B1F",
} as const;

export type CandyColor =
  | "bubblegum"
  | "sunshine"
  | "mint"
  | "sky"
  | "grape"
  | "tangerine"
  | "cream";

/**
 * Background + accessible ink pairings.
 * All combinations use #1B1B1F ink text with >= 4.5:1 WCAG AA contrast
 * (grapeSoft #B997FF provides > 7.4:1 contrast for body copy while grape #9B6BFF
 * is used for large display badges and accents).
 */
export const CANDY_SURFACE_CLASSES: Record<CandyColor, string> = {
  bubblegum: "bg-[#FF7AC6] text-[#1B1B1F]",
  sunshine: "bg-[#FFD93D] text-[#1B1B1F]",
  mint: "bg-[#6BE3B5] text-[#1B1B1F]",
  sky: "bg-[#5CC8FF] text-[#1B1B1F]",
  grape: "bg-[#B997FF] text-[#1B1B1F]",
  tangerine: "bg-[#FF9F43] text-[#1B1B1F]",
  cream: "bg-[#FFF6E5] text-[#1B1B1F]",
};

export const CANDY_ACCENT_HEX: Record<CandyColor, string> = {
  bubblegum: "#FF7AC6",
  sunshine: "#FFD93D",
  mint: "#6BE3B5",
  sky: "#5CC8FF",
  grape: "#B997FF",
  tangerine: "#FF9F43",
  cream: "#FFF6E5",
};

export const AXIS_TILE_COLORS: [CandyColor, CandyColor, CandyColor, CandyColor] = [
  "bubblegum",
  "sunshine",
  "mint",
  "sky",
];

/**
 * Deterministic distinct bright candy color for each of the 16 PoopType cards.
 */
export const TYPE_CARD_COLORS: Record<PoopTypeCode, CandyColor> = {
  PPTO: "mint",
  PPTD: "sky",
  PPLO: "sunshine",
  PPLD: "tangerine",
  PRTO: "grape",
  PRTD: "bubblegum",
  PRLO: "sunshine",
  PRLD: "mint",
  FPTO: "sky",
  FPTD: "tangerine",
  FPLO: "bubblegum",
  FPLD: "mint",
  FRTO: "grape",
  FRTD: "tangerine",
  FRLO: "sunshine",
  FRLD: "sky",
};

export const POLAROID_TILTS = [
  "-rotate-2",
  "rotate-2",
  "-rotate-1",
  "rotate-3",
  "-rotate-3",
] as const;

export const MARQUEE_HEADLINES = [
  "BREAKING: 94.7% OF STATISTICS ON THIS SITE ARE COMPLETELY MADE UP 🔬",
  "PEER-REVIEWED: YOUR POOP NEVER LEAVES YOUR DEVICE 🧻",
  "EXCLUSIVE: SIGMUND FREUD STILL TOO BUSY TO COMMENT 💩",
  "JOURNAL UPDATE: 16 PERSONALITIES, ZERO MEDICAL CREDENTIALS ✨",
  "LAB NOTICE: ALL EXIF & GPS METADATA FLUSHED LOCALLY IN YOUR BROWSER 🚽",
  "HOT TAKE: BRIGHT COLORS + SOBEL EDGES = TOTAL PSEUDOSCIENCE 🔬",
] as const;
