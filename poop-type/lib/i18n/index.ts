import { EN_DICT } from "./en";
import { FA_DICT } from "./fa";
import type { Language, TranslationDictionary } from "./types";

export type { Language, TranslationDictionary } from "./types";

export const DICTIONARIES: Record<Language, TranslationDictionary> = {
  en: EN_DICT,
  fa: FA_DICT,
};

export function getDictionary(lang: Language): TranslationDictionary {
  return DICTIONARIES[lang] ?? EN_DICT;
}

export function isRtl(lang: Language): boolean {
  return lang === "fa";
}

export function toggleLanguage(lang: Language): Language {
  return lang === "en" ? "fa" : "en";
}

export function parseStoredLanguage(value: string | null | undefined): Language {
  return value === "fa" ? "fa" : "en";
}

/**
 * Replaces `{key}` placeholders in localized copy templates cleanly.
 */
export function formatTemplate(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`
  );
}
