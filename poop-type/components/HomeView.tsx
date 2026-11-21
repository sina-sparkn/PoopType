"use client";

import Link from "next/link";
import { UploadAnalyzer } from "@/components/UploadAnalyzer";
import { HomeFaqSection } from "@/components/HomeFaqSection";
import { CandyColor } from "@/lib/theme";
import { formatTemplate } from "@/lib/i18n";
import { useLanguage } from "@/components/LanguageProvider";
import { PoopMascot } from "@/components/mascot/PoopMascot";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import {
  ScrollReveal,
  StaggerGrid,
  StaggerItem,
} from "@/components/motion/MotionPrimitives";

const AXIS_CARD_COLORS: CandyColor[] = [
  "bubblegum",
  "sunshine",
  "sky",
  "tangerine",
];

const HERO_STICKER_STYLES: Array<{
  color: CandyColor;
  tilt: "left" | "right" | "strong-left" | "strong-right";
}> = [
  { color: "mint", tilt: "left" },
  { color: "sky", tilt: "right" },
  { color: "sunshine", tilt: "strong-left" },
  { color: "bubblegum", tilt: "strong-right" },
];

export function HomeView() {
  const { t, dir } = useLanguage();
  const ppto = t.types.PPTO;
  const pplo = t.types.PPLO;
  const marqueeHeadlines = t.home.marqueeHeadlines;

  return (
    <div className="w-full">
      {/* Hero section: bouncy cartoon headline + mascot + rotated sticker chips */}
      <section className="mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 text-center lg:text-start">
            <Sticker color="sunshine" tilt="left" className="mb-4">
              <span aria-hidden="true">🧻</span> {t.home.badge}
            </Sticker>

            <h1
              className="font-display leading-[1.08] tracking-wide text-[#1B1B1F]"
              style={{ fontSize: "clamp(2.35rem, 6.4vw, 4.35rem)" }}
            >
              {t.home.heroTitleBefore}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#FF7AC6] comic-text-shadow">
                  {t.home.heroTitleHighlight}
                </span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 220 18"
                  className="absolute -bottom-2 left-0 w-full h-4"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 11 Q 36 2, 72 11 T 144 10 T 216 9"
                    fill="none"
                    stroke="#FFD93D"
                    strokeWidth="9"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 11 Q 36 2, 72 11 T 144 10 T 216 9"
                    fill="none"
                    stroke="#1B1B1F"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {t.home.heroTitleAfter}
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg font-bold text-[#1B1B1F]/90 lg:mx-0">
              {t.home.heroSubtitle}
            </p>

            {/* 4 rotated sticker chips */}
            <StaggerGrid
              immediate
              staggerDelay={0.05}
              className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              {t.home.heroStickers.map((text, idx) => (
                <StaggerItem key={`${t.lang}-chip-${idx}`}>
                  <Sticker
                    color={HERO_STICKER_STYLES[idx].color}
                    tilt={HERO_STICKER_STYLES[idx].tilt}
                    size="sm"
                  >
                    {text}
                  </Sticker>
                </StaggerItem>
              ))}
            </StaggerGrid>

            {/* Big chunky primary CTA */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                href="#analyzer"
                color="sunshine"
                size="lg"
                data-testid="hero-cta-analyze"
              >
                <span aria-hidden="true">📸</span> {t.home.ctaStart}
              </Button>
              <Button
                href="/types"
                color="cream"
                size="lg"
                data-testid="hero-cta-types"
              >
                <span aria-hidden="true">💩</span> {t.home.ctaTypes}
              </Button>
            </div>
          </div>

          {/* Giant cartoon mascot spotlight */}
          <ScrollReveal
            immediate
            delay={0.06}
            y={12}
            className="lg:col-span-5 flex flex-col items-center justify-center"
          >
            <Card
              color="sky"
              padding="md"
              shadow="lg"
              className="relative flex flex-col items-center text-center w-full max-w-sm"
            >
              <div className="relative mb-2 rounded-2xl border-[3px] border-[#1B1B1F] bg-white px-4 py-2 font-display text-lg text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F]">
                &ldquo;{t.home.mascotBubble}&rdquo;
                <span
                  aria-hidden="true"
                  className="absolute -bottom-2.5 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-[3px] border-r-[3px] border-[#1B1B1F] bg-white"
                />
              </div>
              <PoopMascot
                mood="celebrating"
                code="PPLO"
                size={168}
                label={t.home.mascotAlt}
              />
              <div className="mt-2 flex items-center gap-2">
                <Sticker color="sunshine" size="sm" tilt="left">
                  {t.home.mascotBadge1}
                </Sticker>
                <Sticker color="bubblegum" size="sm" tilt="right">
                  {t.home.mascotBadge2}
                </Sticker>
              </div>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Scrolling Marquee Ticker Strip (kept dir="ltr" so infinite CSS translate loops cleanly in RTL too) */}
      <div
        aria-label={t.home.marqueeAria}
        dir="ltr"
        className="my-6 w-full overflow-hidden border-y-[3px] border-[#1B1B1F] bg-[#FFD93D] py-3"
      >
        <div className="animate-marquee flex items-center gap-8 motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-4">
          {[...marqueeHeadlines, ...marqueeHeadlines].map((headline, i) => (
            <span
              key={`${t.lang}-${i}`}
              dir={dir}
              className={`font-display text-lg sm:text-xl tracking-wide text-[#1B1B1F] whitespace-nowrap ${
                i >= marqueeHeadlines.length ? "motion-reduce:hidden" : ""
              }`}
              aria-hidden={i >= marqueeHeadlines.length ? true : undefined}
            >
              {headline}
              <span className="mx-6 text-[#1B1B1F]" aria-hidden="true">
                ★
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Main Upload Analyzer Card */}
      <ScrollReveal className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <UploadAnalyzer />
      </ScrollReveal>

      {/* Colorful Tappable Sample Report Cards */}
      <section
        aria-labelledby="samples-heading"
        className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <ScrollReveal className="text-center max-w-2xl mx-auto">
          <Sticker color="bubblegum" tilt="right" size="sm">
            <span aria-hidden="true">👀</span> {t.home.samplesBadge}
          </Sticker>
          <h2
            id="samples-heading"
            className="mt-3 font-display text-3xl sm:text-4xl text-[#1B1B1F]"
          >
            {t.home.samplesTitle}
          </h2>
          <p className="mt-2 text-base font-bold text-[#1B1B1F]/85">
            {t.home.samplesSubtitle}
          </p>
        </ScrollReveal>

        <StaggerGrid className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
          <StaggerItem>
            <Link
              href="/result/PPTO?b=2&c=94.7&t=31&o=24&s=74&n=1&h=a1b2c3d4e5f6"
              className="group block h-full rounded-[26px] border-[3px] border-[#1B1B1F] bg-[#6BE3B5] p-6 shadow-[6px_6px_0_#1B1B1F] sticker-press"
            >
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="rounded-[20px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-3 shadow-[3px_3px_0_#1B1B1F]">
                  <PoopMascot code="PPTO" mood="idle" size={96} />
                </div>
                <div className="text-center sm:text-start">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Sticker color="sunshine" size="sm">
                      <span dir="ltr">PPTO</span>
                    </Sticker>
                    <Sticker color="white" size="sm">
                      {ppto.moodLabel}
                    </Sticker>
                  </div>
                  <h3 className="mt-2 font-display text-2xl sm:text-3xl text-[#1B1B1F]">
                    {ppto.nickname}
                  </h3>
                  <p className="mt-1.5 text-base font-bold text-[#1B1B1F]/90">
                    {ppto.blurb}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 font-display text-lg text-[#1B1B1F] underline decoration-[3px] underline-offset-4">
                    {formatTemplate(t.home.openReportCta, { code: "PPTO" })}
                  </span>
                </div>
              </div>
            </Link>
          </StaggerItem>

          <StaggerItem>
            <Link
              href="/result/PPLO?b=4&c=96.2&t=68&o=22&s=78&n=1&h=f6e5d4c3b2a1"
              className="group block h-full rounded-[26px] border-[3px] border-[#1B1B1F] bg-[#FFD93D] p-6 shadow-[6px_6px_0_#1B1B1F] sticker-press"
            >
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="rounded-[20px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-3 shadow-[3px_3px_0_#1B1B1F]">
                  <PoopMascot code="PPLO" mood="celebrating" size={96} />
                </div>
                <div className="text-center sm:text-start">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Sticker color="bubblegum" size="sm">
                      <span dir="ltr">PPLO</span>
                    </Sticker>
                    <Sticker color="white" size="sm">
                      {pplo.moodLabel}
                    </Sticker>
                  </div>
                  <h3 className="mt-2 font-display text-2xl sm:text-3xl text-[#1B1B1F]">
                    {pplo.nickname}
                  </h3>
                  <p className="mt-1.5 text-base font-bold text-[#1B1B1F]/90">
                    {pplo.blurb}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 font-display text-lg text-[#1B1B1F] underline decoration-[3px] underline-offset-4">
                    {formatTemplate(t.home.openReportCta, { code: "PPLO" })}
                  </span>
                </div>
              </div>
            </Link>
          </StaggerItem>
        </StaggerGrid>
      </section>

      {/* Four-Axis Classification Key */}
      <section
        aria-labelledby="axes-heading"
        className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <ScrollReveal className="text-center max-w-2xl mx-auto">
          <Sticker color="sky" tilt="left" size="sm">
            <span aria-hidden="true">📐</span> {t.home.axesBadge}
          </Sticker>
          <h2
            id="axes-heading"
            className="mt-3 font-display text-3xl sm:text-4xl text-[#1B1B1F]"
          >
            {t.home.axesTitle}
          </h2>
          <p className="mt-2 text-base font-bold text-[#1B1B1F]/85">
            {t.home.axesSubtitle}
          </p>
        </ScrollReveal>

        <StaggerGrid className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
          {t.axes.map((axis, idx) => (
            <StaggerItem key={axis.axis}>
              <Card
                as="article"
                color={AXIS_CARD_COLORS[idx]}
                padding="md"
                className="h-full"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-2xl sm:text-3xl text-[#1B1B1F]">
                    {t.home.axisPrefix} {axis.axis}: {axis.name}
                  </h3>
                  <Sticker color="white" size="sm">
                    {axis.measure}
                  </Sticker>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-[16px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-4 shadow-[3px_3px_0_#1B1B1F]">
                    <p className="font-display text-xl text-[#1B1B1F]">
                      {axis.left.letter} = {axis.left.label}
                    </p>
                    <p className="mt-1 text-base font-semibold text-[#1B1B1F]/90">
                      {axis.left.summary}
                    </p>
                  </div>
                  <div className="rounded-[16px] border-[3px] border-[#1B1B1F] bg-white p-4 shadow-[3px_3px_0_#1B1B1F]">
                    <p className="font-display text-xl text-[#1B1B1F]">
                      {axis.right.letter} = {axis.right.label}
                    </p>
                    <p className="mt-1 text-base font-semibold text-[#1B1B1F]/90">
                      {axis.right.summary}
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Kid-Friendly Frequently Asked Questions */}
      <HomeFaqSection />

      {/* Bottom Science Promo Band */}
      <ScrollReveal className="mx-auto max-w-6xl px-4 pt-6 pb-4 sm:px-6 lg:px-8">
        <Card
          as="section"
          color="grape"
          padding="lg"
          className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start"
        >
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="rounded-[20px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-3 shadow-[4px_4px_0_#1B1B1F]">
              <PoopMascot mood="thinking" code="PRTD" size={88} />
            </div>
            <div className="max-w-xl">
              <Sticker color="sunshine" size="sm" tilt="left">
                🔬 {t.home.scienceBadge}
              </Sticker>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl text-[#1B1B1F]">
                {t.home.scienceTitle}
              </h2>
              <p className="mt-1.5 text-base font-bold text-[#1B1B1F]">
                {t.home.scienceBody}
              </p>
            </div>
          </div>

          <Button href="/science" color="sunshine" size="lg">
            {t.home.scienceCta}
          </Button>
        </Card>
      </ScrollReveal>
    </div>
  );
}
