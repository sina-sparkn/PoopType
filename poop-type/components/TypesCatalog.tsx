"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ALL_POOP_CODES, PoopTypeCode } from "@/lib/types-data";
import { CANDY_SURFACE_CLASSES, TYPE_CARD_COLORS } from "@/lib/theme";
import { PoopMascot } from "@/components/mascot/PoopMascot";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import {
  TypeCardModal,
  type SelectedTypeCard,
} from "@/components/TypeCardModal";
import {
  SMOOTH_EASE,
  SPRING_SNAPPY,
} from "@/components/motion/MotionPrimitives";
import { useLanguage } from "@/components/LanguageProvider";
import { formatTemplate } from "@/lib/i18n";
import { playKawaiiSfx } from "@/lib/kawaii-sfx";

export function TypesCatalog() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [formFilter, setFormFilter] = useState<"ALL" | "P" | "F">("ALL");
  const [outlineFilter, setOutlineFilter] = useState<"ALL" | "P" | "R">("ALL");
  const [toneFilter, setToneFilter] = useState<"ALL" | "T" | "L">("ALL");
  const [sheenFilter, setSheenFilter] = useState<"ALL" | "O" | "D">("ALL");
  const [selectedCard, setSelectedCard] = useState<SelectedTypeCard | null>(
    null
  );
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const filtered = useMemo(() => {
    return ALL_POOP_CODES.filter((code) => {
      if (formFilter !== "ALL" && code[0] !== formFilter) return false;
      if (outlineFilter !== "ALL" && code[1] !== outlineFilter) return false;
      if (toneFilter !== "ALL" && code[2] !== toneFilter) return false;
      if (sheenFilter !== "ALL" && code[3] !== sheenFilter) return false;
      return true;
    });
  }, [formFilter, outlineFilter, sheenFilter, toneFilter]);

  const hasFilters =
    formFilter !== "ALL" ||
    outlineFilter !== "ALL" ||
    toneFilter !== "ALL" ||
    sheenFilter !== "ALL";

  const resetFilters = () => {
    playKawaiiSfx("pop");
    setFormFilter("ALL");
    setOutlineFilter("ALL");
    setToneFilter("ALL");
    setSheenFilter("ALL");
  };

  const openCardModal = useCallback(
    (code: PoopTypeCode, triggerEl: HTMLButtonElement) => {
      playKawaiiSfx("cardFlip");
      lastTriggerRef.current = triggerEl;
      const rect = triggerEl.getBoundingClientRect();
      setSelectedCard({
        code,
        originRect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
      });
    },
    []
  );

  const closeCardModal = useCallback(() => {
    playKawaiiSfx("cardClose");
    setSelectedCard(null);
    window.setTimeout(() => {
      lastTriggerRef.current?.focus();
    }, 60);
  }, []);

  const [axisForm, axisOutline, axisTone, axisSheen] = t.axes;

  return (
    <div>
      {/* Chunky sticker axis filter bar */}
      <Card color="white" padding="md" shadow="md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-dashed border-[#1B1B1F]/20 pb-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <Sticker color="sunshine" tilt="left" size="sm">
              🔍 {t.typesPage.filterBadge}
            </Sticker>
            <span className="text-base font-extrabold text-[#1B1B1F]">
              {formatTemplate(t.typesPage.showingCount, {
                count: filtered.length,
              })}
            </span>
          </div>

          <AnimatePresence>
            {hasFilters && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.18, ease: SMOOTH_EASE }}
                onClick={resetFilters}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border-[3px] border-[#1B1B1F] bg-[#FF7AC6] px-4 py-2 font-display text-base text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F] sticker-press cursor-pointer"
              >
                {t.typesPage.resetAll}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterGroup
            groupId="form"
            label={axisForm.name}
            accent="bubblegum"
            value={formFilter}
            onChange={(v) => setFormFilter(v as "ALL" | "P" | "F")}
            options={[
              { value: "ALL", label: t.typesPage.filterAll },
              {
                value: "P",
                label: `${axisForm.left.letter} · ${axisForm.left.label}`,
              },
              {
                value: "F",
                label: `${axisForm.right.letter} · ${axisForm.right.label}`,
              },
            ]}
          />
          <FilterGroup
            groupId="outline"
            label={axisOutline.name}
            accent="sunshine"
            value={outlineFilter}
            onChange={(v) => setOutlineFilter(v as "ALL" | "P" | "R")}
            options={[
              { value: "ALL", label: t.typesPage.filterAll },
              {
                value: "P",
                label: `${axisOutline.left.letter} · ${axisOutline.left.label}`,
              },
              {
                value: "R",
                label: `${axisOutline.right.letter} · ${axisOutline.right.label}`,
              },
            ]}
          />
          <FilterGroup
            groupId="tone"
            label={axisTone.name}
            accent="mint"
            value={toneFilter}
            onChange={(v) => setToneFilter(v as "ALL" | "T" | "L")}
            options={[
              { value: "ALL", label: t.typesPage.filterAll },
              {
                value: "T",
                label: `${axisTone.left.letter} · ${axisTone.left.label}`,
              },
              {
                value: "L",
                label: `${axisTone.right.letter} · ${axisTone.right.label}`,
              },
            ]}
          />
          <FilterGroup
            groupId="sheen"
            label={axisSheen.name}
            accent="sky"
            value={sheenFilter}
            onChange={(v) => setSheenFilter(v as "ALL" | "O" | "D")}
            options={[
              { value: "ALL", label: t.typesPage.filterAll },
              {
                value: "O",
                label: `${axisSheen.left.letter} · ${axisSheen.left.label}`,
              },
              {
                value: "D",
                label: `${axisSheen.right.letter} · ${axisSheen.right.label}`,
              },
            ]}
          />
        </div>
      </Card>

      {/* Hint bar */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-base font-bold text-[#1B1B1F]">
          {t.typesPage.hint}
        </p>
      </div>

      {/* 16 Collectible Trading Cards — uniform compact grid, never stretches sibling cards */}
      <motion.div
        layout
        className="mt-4 grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((code, index) => {
            const localized = t.types[code];
            const cardColor = TYPE_CARD_COLORS[code];
            const isSelected = selectedCard?.code === code;

            return (
              <motion.div
                key={code}
                layout="position"
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, y: 16, scale: 0.96 }
                }
                animate={{
                  opacity: isSelected ? 0.25 : 1,
                  y: 0,
                  scale: isSelected ? 0.95 : 1,
                }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.92 }
                }
                transition={{
                  layout: { duration: 0.28, ease: SMOOTH_EASE },
                  opacity: {
                    duration: isSelected ? 0.16 : 0.22,
                    delay: isSelected ? 0 : Math.min(index * 0.02, 0.2),
                  },
                  y: {
                    duration: 0.3,
                    delay: Math.min(index * 0.02, 0.2),
                    ease: SMOOTH_EASE,
                  },
                  scale: { duration: 0.22, ease: SMOOTH_EASE },
                }}
                whileHover={
                  prefersReducedMotion || isSelected ? undefined : { y: -4 }
                }
                whileTap={
                  prefersReducedMotion || isSelected ? undefined : { scale: 0.98 }
                }
                data-testid={`type-card-${code}`}
                className={`flex flex-col rounded-[24px] border-[3px] border-[#1B1B1F] shadow-[5px_5px_0_#1B1B1F] ${CANDY_SURFACE_CLASSES[cardColor]}`}
              >
                <button
                  type="button"
                  onClick={(e) => openCardModal(code, e.currentTarget)}
                  aria-haspopup="dialog"
                  aria-expanded={isSelected}
                  aria-label={formatTemplate(t.typesPage.cardAria, {
                    code,
                    nickname: localized.nickname,
                    mood: localized.moodLabel,
                  })}
                  className="group flex h-full w-full flex-col items-center p-3.5 sm:p-5 text-center cursor-pointer focus-visible:outline-none rounded-[21px] touch-manipulation"
                >
                  <div className="flex w-full items-center justify-between gap-1.5">
                    <span
                      dir="ltr"
                      className="inline-flex items-center rounded-full border-[3px] border-[#1B1B1F] bg-white px-2.5 py-0.5 font-display text-base sm:text-lg tracking-wider text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F]"
                    >
                      {code}
                    </span>
                    <span
                      aria-hidden="true"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border-[2.5px] border-[#1B1B1F] bg-[#FFF6E5] text-sm font-black text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F] transition-transform group-hover:scale-110"
                    >
                      +
                    </span>
                  </div>

                  {/* Unique per-type PoopMascot variant */}
                  <div className="my-2.5 flex items-center justify-center rounded-[20px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] px-3 py-2 w-full shadow-[3px_3px_0_#1B1B1F]">
                    <PoopMascot
                      code={code}
                      mood="idle"
                      size={90}
                      label={`${code} ${localized.nickname}`}
                    />
                  </div>

                  <h2 className="mt-1 font-display text-lg sm:text-xl leading-tight text-[#1B1B1F]">
                    {localized.nickname}
                  </h2>
                  <p className="mt-1 text-sm sm:text-base font-bold text-[#1B1B1F]/80">
                    {localized.moodLabel} · {t.typesPage.tapToFlip}
                  </p>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Hovering 3D-flipping collectible card modal */}
      <TypeCardModal selected={selectedCard} onClose={closeCardModal} />
    </div>
  );
}

function FilterGroup({
  groupId,
  label,
  accent,
  value,
  onChange,
  options,
}: {
  groupId: string;
  label: string;
  accent: "bubblegum" | "sunshine" | "mint" | "sky";
  value: string;
  onChange: (val: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-display text-base tracking-wide text-[#1B1B1F]">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (opt.value !== value) {
                    playKawaiiSfx("pop");
                  }
                  onChange(opt.value);
                }}
                aria-pressed={active}
              className={`relative inline-flex min-h-[48px] items-center justify-center rounded-full border-[3px] border-[#1B1B1F] px-3.5 py-2 text-sm sm:text-base font-extrabold whitespace-nowrap cursor-pointer sticker-press ${
                active
                  ? "text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F]"
                  : "bg-[#FFF6E5] text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F] hover:bg-white"
              }`}
            >
              {active && (
                <motion.span
                  layoutId={`filter-pill-${groupId}`}
                  transition={SPRING_SNAPPY}
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-full ${CANDY_SURFACE_CLASSES[accent]}`}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
