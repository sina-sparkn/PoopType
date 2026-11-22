"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  HelpCircle,
  Images,
  Lock,
  Search,
  Smile,
  Target,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { PoopMascot } from "@/components/mascot/PoopMascot";
import {
  ScrollReveal,
  SMOOTH_EASE,
  SPRING_SNAPPY,
} from "@/components/motion/MotionPrimitives";
import { playKawaiiSfx } from "@/lib/kawaii-sfx";

const FAQ_ICON_MAP: Record<string, LucideIcon> = {
  "how-it-works": Search,
  "same-photo": Target,
  "multiple-photos": Images,
  privacy: Lock,
  "yellow-warning": AlertTriangle,
  "real-personality": Smile,
};

export function HomeFaqSection() {
  const { t } = useLanguage();
  const faq = t.home.faq;
  const prefersReducedMotion = useReducedMotion();

  // Keep the first question open by default so visitors immediately see the simple explanation
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "how-it-works": true,
  });

  const allOpen = faq.items.every((item) => Boolean(openIds[item.id]));

  const toggleOne = (id: string) => {
    const nextOpen = !openIds[id];
    playKawaiiSfx(nextOpen ? "accordionOpen" : "accordionClose");
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = () => {
    if (allOpen) {
      playKawaiiSfx("accordionClose");
      setOpenIds({});
    } else {
      playKawaiiSfx("accordionOpen");
      const next: Record<string, boolean> = {};
      for (const item of faq.items) {
        next[item.id] = true;
      }
      setOpenIds(next);
    }
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      data-testid="home-faq-section"
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 scroll-mt-24"
    >
      <ScrollReveal>
        <Card color="cream" padding="lg" shadow="lg">
          {/* Header row with cute curious mascot + expand/collapse button */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-2xl">
              <Sticker color="sunshine" tilt="left" size="sm">
                <HelpCircle
                  className="h-4 w-4 shrink-0 text-[#1B1B1F]"
                  strokeWidth={2.75}
                  aria-hidden="true"
                />{" "}
                {faq.badge}
              </Sticker>
              <h2
                id="faq-heading"
                className="mt-3 font-display text-3xl sm:text-4xl text-[#1B1B1F]"
              >
                {faq.title}
              </h2>
              <p className="mt-2 text-base font-bold leading-relaxed text-[#1B1B1F]/85">
                {faq.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
              <div className="hidden sm:flex rounded-[18px] border-[3px] border-[#1B1B1F] bg-white p-2 shadow-[3px_3px_0_#1B1B1F] rotate-2">
                <PoopMascot
                  code="FRLO"
                  mood="thinking"
                  size={68}
                  animated={false}
                />
              </div>
              <button
                type="button"
                onClick={toggleAll}
                data-testid="faq-toggle-all"
                className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border-[3px] border-[#1B1B1F] bg-[#FFD93D] px-4 py-2 text-sm sm:text-base font-extrabold text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F] sticker-press cursor-pointer whitespace-nowrap touch-manipulation"
              >
                {allOpen ? (
                  <ChevronsDownUp
                    className="h-4 w-4 shrink-0"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronsUpDown
                    className="h-4 w-4 shrink-0"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                )}
                <span>{allOpen ? faq.collapseAll : faq.expandAll}</span>
              </button>
            </div>
          </div>

          {/* Accordion list */}
          <ul className="mt-6 space-y-3.5">
            {faq.items.map((item) => {
              const isOpen = Boolean(openIds[item.id]);
              const panelId = `faq-panel-${item.id}`;
              const ItemIcon = FAQ_ICON_MAP[item.id] ?? HelpCircle;

              return (
                <li
                  key={item.id}
                  data-testid={`faq-item-${item.id}`}
                  className="rounded-[22px] border-[3px] border-[#1B1B1F] bg-white shadow-[4px_4px_0_#1B1B1F] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleOne(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full min-h-[64px] items-center justify-between gap-3 p-4 sm:p-5 text-start cursor-pointer touch-manipulation hover:bg-[#FFFDF7] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        aria-hidden="true"
                        style={{ backgroundColor: item.badgeColor }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-[2.5px] border-[#1B1B1F] text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F]"
                      >
                        <ItemIcon className="h-5 w-5" strokeWidth={2.5} />
                      </span>
                      <span className="font-display text-lg sm:text-xl leading-snug text-[#1B1B1F]">
                        {item.question}
                      </span>
                    </div>

                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={SPRING_SNAPPY}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#1B1B1F] text-[#1B1B1F] transition-colors ${
                        isOpen ? "bg-[#FFD93D]" : "bg-[#FFF6E5]"
                      }`}
                    >
                      <ChevronDown className="h-5 w-5" strokeWidth={2.75} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { height: 0, opacity: 0 }
                        }
                        animate={{ height: "auto", opacity: 1 }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { height: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.28, ease: SMOOTH_EASE }}
                        className="overflow-hidden"
                      >
                        <div className="border-t-2 border-dashed border-[#1B1B1F]/30 bg-[#FFF6E5]/80 px-4 py-4 sm:px-6 sm:py-5">
                          <p className="text-base sm:text-[17px] font-semibold leading-7 text-[#1B1B1F] max-w-prose">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Card>
      </ScrollReveal>
    </section>
  );
}
