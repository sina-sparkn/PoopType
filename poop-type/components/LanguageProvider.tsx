"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  getDictionary,
  isRtl,
  parseStoredLanguage,
  toggleLanguage,
  type Language,
  type TranslationDictionary,
} from "@/lib/i18n";
import { playKawaiiSfx } from "@/lib/kawaii-sfx";

const STORAGE_KEY = "pooptype_lang";

let cachedLang: Language | null = null;
const listeners = new Set<() => void>();

function readClientLanguage(): Language {
  if (cachedLang) return cachedLang;
  if (typeof window === "undefined") return "en";
  try {
    cachedLang = parseStoredLanguage(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    cachedLang = "en";
  }
  return cachedLang;
}

function writeClientLanguage(next: Language) {
  cachedLang = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage quota / private mode failures
    }
  }
  for (const listener of listeners) {
    listener();
  }
}

function subscribeLanguage(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedLang = parseStoredLanguage(e.newValue);
      listener();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function getServerLanguage(): Language {
  return "en";
}

export interface LanguageContextValue {
  lang: Language;
  dir: "ltr" | "rtl";
  rtl: boolean;
  t: TranslationDictionary;
  setLanguage: (lang: Language) => void;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(
    subscribeLanguage,
    readClientLanguage,
    getServerLanguage
  );

  const dir: "ltr" | "rtl" = isRtl(lang) ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [dir, lang]);

  const setLanguage = useCallback((next: Language) => {
    writeClientLanguage(next);
  }, []);

  const toggle = useCallback(() => {
    writeClientLanguage(toggleLanguage(readClientLanguage()));
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      dir,
      rtl: dir === "rtl",
      t: getDictionary(lang),
      setLanguage,
      toggle,
    }),
    [dir, lang, setLanguage, toggle]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside a LanguageProvider.");
  }
  return ctx;
}

export function LanguageSwitcher({
  compact = false,
  testId = "lang-switcher",
}: {
  compact?: boolean;
  testId?: string;
}) {
  const { lang, t, toggle } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => {
        playKawaiiSfx("pop");
        toggle();
      }}
      aria-label={t.switcherAria}
      data-testid={testId}
      data-lang={lang}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border-[3px] border-[#1B1B1F] bg-[#FFD93D] font-display text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation whitespace-nowrap shrink-0 ${
        compact
          ? "min-h-[42px] px-3 py-1 text-sm"
          : "min-h-[44px] px-3.5 py-1.5 text-base"
      }`}
    >
      <span aria-hidden="true">{lang === "en" ? "🌐" : "🌐"}</span>
      <span>{t.switcherLabel}</span>
    </button>
  );
}
