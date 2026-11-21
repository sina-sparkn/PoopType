"use client";

import { TypesCatalog } from "@/components/TypesCatalog";
import { Sticker } from "@/components/ui/Sticker";
import { Card } from "@/components/ui/Card";
import { PoopMascot } from "@/components/mascot/PoopMascot";
import { ScrollReveal } from "@/components/motion/MotionPrimitives";
import { useLanguage } from "@/components/LanguageProvider";

export function TypesPageView() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Playful Sticker-Book Hero Header */}
      <ScrollReveal immediate y={16}>
        <Card
          color="sky"
          padding="lg"
          shadow="lg"
          as="header"
          className="relative"
        >
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <Sticker color="sunshine" tilt="left" size="sm">
                  🃏 {t.typesPage.badge1}
                </Sticker>
                <Sticker color="white" tilt="right" size="sm">
                  {t.typesPage.badge2}
                </Sticker>
              </div>

              <h1 className="mt-4 font-display text-[clamp(2.1rem,6vw,3.75rem)] leading-[1.08] text-[#1B1B1F]">
                {t.typesPage.titleBefore}
                <span className="relative inline-block">
                  <span className="relative z-10">
                    {t.typesPage.titleHighlight}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 right-0 h-3.5 -rotate-1 rounded-full bg-[#FFD93D] border-2 border-[#1B1B1F]"
                  />
                </span>
              </h1>

              <p className="mt-4 text-base sm:text-lg font-bold leading-relaxed text-[#1B1B1F]">
                {t.typesPage.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3 self-center md:self-auto">
              <div className="rounded-[22px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-3 shadow-[4px_4px_0_#1B1B1F] -rotate-2">
                <PoopMascot
                  code="PPLO"
                  mood="celebrating"
                  size={104}
                  label={t.types.PPLO.nickname}
                />
              </div>
              <div className="rounded-[22px] border-[3px] border-[#1B1B1F] bg-[#FF7AC6] p-3 shadow-[4px_4px_0_#1B1B1F] rotate-2">
                <PoopMascot
                  code="FRLD"
                  mood="idle"
                  size={104}
                  label={t.types.FRLD.nickname}
                />
              </div>
            </div>
          </div>
        </Card>
      </ScrollReveal>

      <div className="mt-8">
        <TypesCatalog />
      </div>
    </div>
  );
}
