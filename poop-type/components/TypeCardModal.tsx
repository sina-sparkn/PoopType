"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { POOP_TYPES, type PoopTypeCode } from "@/lib/types-data";
import { CANDY_SURFACE_CLASSES, TYPE_CARD_COLORS } from "@/lib/theme";
import {
  computeFlipOriginTransform,
  type RectLike,
} from "@/lib/card-flip-geometry";
import { PoopMascot } from "@/components/mascot/PoopMascot";
import { Button } from "@/components/ui/Button";
import { SMOOTH_EASE } from "@/components/motion/MotionPrimitives";
import { useLanguage } from "@/components/LanguageProvider";
import { formatTemplate } from "@/lib/i18n";

export interface SelectedTypeCard {
  code: PoopTypeCode;
  originRect: RectLike | null;
}

interface TypeCardModalProps {
  selected: SelectedTypeCard | null;
  onClose: () => void;
}

export function TypeCardModal({ selected, onClose }: TypeCardModalProps) {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Lock page scroll & listen for Escape while modal is open
  useEffect(() => {
    if (!selected) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    // Move keyboard focus into the dialog cleanly once mounted
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 40);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, selected]);

  const flipOrigin = useMemo(() => {
    if (!selected || !isClient) {
      return { x: 0, y: 24, scale: 0.88 };
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const estimatedModalWidth = Math.min(vw - 32, 512);
    const estimatedModalHeight = Math.min(vh * 0.86, 620);
    return computeFlipOriginTransform(
      selected.originRect,
      { width: vw, height: vh },
      estimatedModalWidth,
      estimatedModalHeight
    );
  }, [isClient, selected]);

  if (!isClient) {
    return null;
  }

  const profile = selected ? POOP_TYPES[selected.code] : null;
  const localized = selected ? t.types[selected.code] : null;
  const cardColor = selected ? TYPE_CARD_COLORS[selected.code] : "mint";

  return createPortal(
    <AnimatePresence>
      {selected && profile && localized && (
        <motion.div
          key="type-card-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.14 : 0.24, ease: SMOOTH_EASE }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          data-testid="type-card-modal-backdrop"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1B1B1F]/70 p-4 sm:p-6"
          style={{ perspective: prefersReducedMotion ? undefined : 1400 }}
        >
          {/* Outer flight wrapper: lifts smoothly from the clicked card's rect to viewport center */}
          <motion.div
            key={`type-modal-flight-${selected.code}`}
            initial={
              prefersReducedMotion
                ? { opacity: 0, scale: 0.96 }
                : {
                    x: flipOrigin.x,
                    y: flipOrigin.y,
                    scale: flipOrigin.scale,
                    opacity: 0.95,
                  }
            }
            animate={{
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
            }}
            exit={
              prefersReducedMotion
                ? { opacity: 0, scale: 0.96 }
                : {
                    x: flipOrigin.x,
                    y: flipOrigin.y,
                    scale: flipOrigin.scale,
                    opacity: 0,
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.15, ease: SMOOTH_EASE }
                : {
                    type: "spring",
                    stiffness: 270,
                    damping: 27,
                    mass: 0.9,
                  }
            }
            className="relative w-full max-w-lg"
            style={{
              transformStyle: prefersReducedMotion ? undefined : "preserve-3d",
            }}
          >
            {/* Inner 3D flip stage: spins smoothly from front face (180deg) to back dossier (0deg) */}
            <motion.div
              initial={
                prefersReducedMotion ? false : { rotateY: 180 }
              }
              animate={{ rotateY: 0 }}
              exit={
                prefersReducedMotion ? undefined : { rotateY: 180 }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0.14 }
                  : {
                      type: "spring",
                      stiffness: 220,
                      damping: 24,
                      mass: 0.95,
                    }
              }
              className="relative w-full"
              style={{
                transformStyle: prefersReducedMotion
                  ? undefined
                  : "preserve-3d",
              }}
            >
              {/* FRONT FACE (visible briefly as card lifts off the grid and flips over) */}
              {!prefersReducedMotion && (
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-[26px] border-[3px] border-[#1B1B1F] p-6 text-center shadow-[8px_8px_0_#1B1B1F] ${CANDY_SURFACE_CLASSES[cardColor]}`}
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <span
                    dir="ltr"
                    className="inline-flex items-center rounded-full border-[3px] border-[#1B1B1F] bg-white px-4 py-1 font-display text-2xl tracking-wider text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F]"
                  >
                    {profile.code}
                  </span>
                  <div className="my-5 flex w-full max-w-[240px] items-center justify-center rounded-[22px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] px-4 py-5 shadow-[4px_4px_0_#1B1B1F]">
                    <PoopMascot
                      code={profile.code}
                      mood="idle"
                      size={112}
                      animated={false}
                    />
                  </div>
                  <p className="font-display text-2xl text-[#1B1B1F]">
                    {localized.nickname}
                  </p>
                  <p className="mt-1 text-base font-bold text-[#1B1B1F]/80">
                    {localized.moodLabel}
                  </p>
                </div>
              )}

              {/* BACK FACE (Interactive hovering collectible card dossier modal) */}
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="type-card-modal-title"
                data-testid="type-card-modal"
                data-type-code={profile.code}
                className={`relative max-h-[88dvh] overflow-y-auto rounded-[24px] sm:rounded-[26px] border-[3px] border-[#1B1B1F] p-3.5 sm:p-5 shadow-[8px_8px_0_#1B1B1F] ${CANDY_SURFACE_CLASSES[cardColor]}`}
                style={{
                  transform: prefersReducedMotion ? undefined : "rotateY(0deg)",
                  backfaceVisibility: prefersReducedMotion
                    ? undefined
                    : "hidden",
                  WebkitBackfaceVisibility: prefersReducedMotion
                    ? undefined
                    : "hidden",
                }}
              >
                {/* Top bar: Code + Mood badge + chunky Close button */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      dir="ltr"
                      className="inline-flex items-center rounded-full border-[3px] border-[#1B1B1F] bg-white px-3 py-0.5 sm:px-3.5 sm:py-1 font-display text-lg sm:text-xl tracking-wider text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F]"
                    >
                      {profile.code}
                    </span>
                    <span className="inline-flex items-center rounded-full border-[3px] border-[#1B1B1F] bg-[#FFF6E5] px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-extrabold text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F]">
                      {localized.moodLabel}
                    </span>
                  </div>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={onClose}
                    aria-label={formatTemplate(t.typesPage.modalCloseAria, {
                      code: profile.code,
                    })}
                    data-testid="type-modal-close"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-[#1B1B1F] bg-[#FFF6E5] text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#1B1B1F"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Mascot + Title Banner */}
                <div className="mt-2.5 sm:mt-3.5 flex items-center gap-3 sm:gap-4">
                  <div className="flex shrink-0 items-center justify-center rounded-[18px] sm:rounded-[20px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-2 sm:p-2.5 shadow-[3px_3px_0_#1B1B1F]">
                    <PoopMascot
                      code={profile.code}
                      mood="celebrating"
                      size={74}
                      label={`${profile.code} ${localized.nickname}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-start">
                    <h2
                      id="type-card-modal-title"
                      className="font-display text-xl sm:text-3xl leading-[1.12] text-[#1B1B1F]"
                    >
                      {localized.nickname}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm font-extrabold leading-snug text-[#1B1B1F]/85">
                      ✨ {localized.famousFor}
                    </p>
                  </div>
                </div>

                {/* White inner dossier panel */}
                <div className="mt-3 sm:mt-4 rounded-[18px] sm:rounded-[20px] border-[3px] border-[#1B1B1F] bg-white p-3.5 sm:p-5 text-start shadow-[4px_4px_0_#1B1B1F]">
                  <p className="text-[15px] sm:text-base font-bold leading-snug sm:leading-relaxed text-[#1B1B1F]">
                    {localized.blurb}
                  </p>

                  {/* Style + Match + Clash sticker pills */}
                  <div className="mt-2.5 sm:mt-3.5 flex flex-wrap gap-1.5 sm:gap-2">
                    <span className="inline-flex items-center rounded-full border-[2.5px] border-[#1B1B1F] bg-[#FFF6E5] px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-extrabold text-[#1B1B1F]">
                      🛋️ {localized.styleLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border-[2.5px] border-[#1B1B1F] bg-[#6BE3B5] px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-extrabold text-[#1B1B1F]">
                      <span>💚 {t.typesPage.matchLabel}:</span>
                      <span dir="ltr">{profile.bestMatch}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border-[2.5px] border-[#1B1B1F] bg-[#FF7AC6] px-2.5 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm font-extrabold text-[#1B1B1F]">
                      <span>⚡ {t.typesPage.clashLabel}:</span>
                      <span dir="ltr">{profile.worstMatch}</span>
                    </span>
                  </div>

                  {/* Compact side-by-side Strengths & Quirks */}
                  <div className="mt-2.5 sm:mt-3.5 grid grid-cols-2 gap-2 sm:gap-2.5">
                    <div className="rounded-[14px] sm:rounded-[16px] border-[2.5px] border-[#1B1B1F] bg-[#6BE3B5]/35 p-2.5 sm:p-3">
                      <p className="font-display text-xs sm:text-sm tracking-wide text-[#1B1B1F]">
                        ✅ {t.typesPage.strengthsTitle}
                      </p>
                      <ul className="mt-1 space-y-0.5 sm:space-y-1 text-xs sm:text-sm font-bold leading-snug text-[#1B1B1F]">
                        {localized.strengths.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-[14px] sm:rounded-[16px] border-[2.5px] border-[#1B1B1F] bg-[#FF7AC6]/30 p-2.5 sm:p-3">
                      <p className="font-display text-xs sm:text-sm tracking-wide text-[#1B1B1F]">
                        😅 {t.typesPage.flawsTitle}
                      </p>
                      <ul className="mt-1 space-y-0.5 sm:space-y-1 text-xs sm:text-sm font-bold leading-snug text-[#1B1B1F]">
                        {localized.flaws.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Full Card CTA */}
                  <div className="mt-3 sm:mt-4">
                    <Button
                      href={`/result/${profile.code}`}
                      color="sunshine"
                      size="md"
                      fullWidth
                      onClick={onClose}
                    >
                      {t.typesPage.fullDossier}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
