"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
} from "lucide-react";
import {
  SMOOTH_EASE,
  SPRING_SNAPPY,
} from "@/components/motion/MotionPrimitives";
import { useLanguage } from "@/components/LanguageProvider";
import { formatTemplate } from "@/lib/i18n";
import { playKawaiiSfx } from "@/lib/kawaii-sfx";

export interface ScienceStudyItem {
  id: string;
  badgeColor: string;
  headline: string;
  statChip: string;
  citation: string;
  details: string;
}

interface ScienceStudiesAccordionProps {
  studies: ScienceStudyItem[];
}

export function ScienceStudiesAccordion({
  studies,
}: ScienceStudiesAccordionProps) {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const allOpen = studies.every((study) => Boolean(openIds[study.id]));

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
      for (const s of studies) {
        next[s.id] = true;
      }
      setOpenIds(next);
    }
  };

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-extrabold tracking-wide text-[#1B1B1F]">
          <BookOpen
            className="h-4 w-4 shrink-0 text-[#1B1B1F]"
            strokeWidth={2.5}
            aria-hidden="true"
          />
          <span>
            {studies.length === 1
              ? t.science.studyCountSingle
              : formatTemplate(t.science.studyCountPlural, {
                  count: studies.length,
                })}
          </span>
        </span>
        {studies.length > 1 && (
          <button
            type="button"
            onClick={toggleAll}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border-2 border-[#1B1B1F] bg-[#FFF6E5] px-3.5 py-1 text-sm font-extrabold text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation"
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
            <span>{allOpen ? t.science.collapseAll : t.science.expandAll}</span>
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {studies.map((study) => {
          const isOpen = Boolean(openIds[study.id]);
          const detailsId = `study-details-${study.id.replace("#", "")}`;

          return (
            <li
              key={study.id}
              className="rounded-[20px] border-[3px] border-[#1B1B1F] bg-white shadow-[3px_3px_0_#1B1B1F] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleOne(study.id)}
                aria-expanded={isOpen}
                aria-controls={detailsId}
                className="flex w-full min-h-[60px] items-start justify-between gap-3 p-4 sm:p-5 text-start cursor-pointer touch-manipulation hover:bg-[#FFFDF7] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      dir="ltr"
                      style={{ backgroundColor: study.badgeColor }}
                      className="inline-flex items-center rounded-full border-2 border-[#1B1B1F] px-2.5 py-0.5 font-display text-sm text-[#1B1B1F]"
                    >
                      {study.id}
                    </span>
                    <span className="inline-flex items-center rounded-full border-2 border-[#1B1B1F] bg-[#FFF6E5] px-2.5 py-0.5 text-xs font-extrabold text-[#1B1B1F]">
                      {study.statChip}
                    </span>
                  </div>
                  <p className="mt-2 text-base sm:text-[17px] font-extrabold leading-snug text-[#1B1B1F] max-w-prose">
                    {study.headline}
                  </p>
                </div>

                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={SPRING_SNAPPY}
                  className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#1B1B1F] text-[#1B1B1F] transition-colors ${
                    isOpen ? "bg-[#FFD93D]" : "bg-[#FFF6E5]"
                  }`}
                >
                  <ChevronDown className="h-5 w-5" strokeWidth={2.75} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={detailsId}
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
                    <div className="border-t-2 border-dashed border-[#1B1B1F]/35 bg-[#FFF6E5]/75 px-4 py-3.5 sm:px-5 sm:py-4">
                      <p className="text-sm font-extrabold text-[#1B1B1F]">
                        {study.citation}
                      </p>
                      <p className="mt-1.5 text-base font-medium leading-7 text-[#1B1B1F] max-w-prose">
                        {study.details}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
