import type { PortfolioAnalysisResult } from "./analyze";

/**
 * Ephemeral in-memory store holding sanitized (EXIF-stripped) preview Data URLs
 * and the latest analysis result for the current browser session only. Nothing
 * is ever persisted to a server or even localStorage — closing the tab clears
 * everything immediately.
 */

const EMPTY_PREVIEWS: string[] = [];

let currentSessionSeed: string | null = null;
let currentSanitizedPreviews: string[] = EMPTY_PREVIEWS;
let currentSessionResult: PortfolioAnalysisResult | null = null;
const listeners = new Set<() => void>();

export function saveSessionPreviews(seedHex: string, previews: string[]): void {
  currentSessionSeed = seedHex;
  currentSanitizedPreviews = previews.length > 0 ? [...previews] : EMPTY_PREVIEWS;
  listeners.forEach((fn) => fn());
}

export function saveSessionAnalysis(
  result: PortfolioAnalysisResult,
  previews: string[]
): void {
  currentSessionSeed = result.seedHex;
  currentSessionResult = result;
  currentSanitizedPreviews = previews.length > 0 ? [...previews] : EMPTY_PREVIEWS;
  listeners.forEach((fn) => fn());
}

export function getSessionPreviews(seedHex: string): string[] {
  if (currentSessionSeed !== seedHex) {
    return EMPTY_PREVIEWS;
  }
  return currentSanitizedPreviews;
}

export function getSessionResult(seedHex: string): PortfolioAnalysisResult | null {
  if (currentSessionSeed !== seedHex) {
    return null;
  }
  return currentSessionResult;
}

export function getEmptyPreviews(): string[] {
  return EMPTY_PREVIEWS;
}

export function subscribeSessionPreviews(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function clearSessionPreviews(): void {
  currentSessionSeed = null;
  currentSessionResult = null;
  currentSanitizedPreviews = EMPTY_PREVIEWS;
  listeners.forEach((fn) => fn());
}
