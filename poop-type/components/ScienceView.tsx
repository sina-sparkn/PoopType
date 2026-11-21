"use client";

import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { Button } from "@/components/ui/Button";
import { PoopMascot } from "@/components/mascot/PoopMascot";
import { ScienceStudiesAccordion } from "@/components/ScienceStudiesAccordion";
import {
  ScrollReveal,
  SmoothAnchorLink,
  StaggerGrid,
  StaggerItem,
} from "@/components/motion/MotionPrimitives";
import { useLanguage } from "@/components/LanguageProvider";

export function ScienceView() {
  const { t } = useLanguage();
  const s = t.science;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Compact Comic Hero Header */}
      <ScrollReveal immediate y={16}>
        <Card color="mint" padding="lg" shadow="lg" as="header">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <Sticker color="sunshine" tilt="left" size="sm">
                  🔬 {s.badge1}
                </Sticker>
                <Sticker color="white" tilt="right" size="sm">
                  {s.badge2}
                </Sticker>
              </div>
              <h1 className="mt-3 font-display text-[clamp(2.1rem,6vw,3.5rem)] leading-[1.08] text-[#1B1B1F]">
                {s.titleBefore}
                <span className="relative inline-block">
                  <span className="relative z-10">{s.titleHighlight}</span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 right-0 h-3.5 -rotate-1 rounded-full bg-[#FFD93D] border-2 border-[#1B1B1F]"
                  />
                </span>
              </h1>
              <p className="mt-3 text-base sm:text-[17px] font-medium leading-7 text-[#1B1B1F] max-w-prose">
                <strong className="font-extrabold">{s.shortVersionLead}</strong>{" "}
                {s.shortVersionBeforeNot}
                <strong className="font-extrabold underline decoration-[3px] underline-offset-4">
                  {s.shortVersionNot}
                </strong>
                {s.shortVersionAfterNot}
              </p>
            </div>

            <div className="flex flex-col items-center self-center sm:self-auto shrink-0">
              <div className="relative mb-2 rounded-2xl border-[3px] border-[#1B1B1F] bg-white px-3 py-1.5 text-sm font-extrabold text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F]">
                &ldquo;{s.mascotBubble}&rdquo;
              </div>
              <div className="rounded-[22px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-2.5 shadow-[4px_4px_0_#1B1B1F]">
                <PoopMascot
                  code="PPTO"
                  mood="thinking"
                  size={96}
                  label={s.mascotAlt}
                />
              </div>
            </div>
          </div>

          {/* Quick-Jump Section Pills with Framer Motion smooth scroll */}
          <nav
            aria-label={s.sectionsAria}
            className="mt-5 flex flex-wrap gap-2 border-t-2 border-dashed border-[#1B1B1F]/30 pt-4"
          >
            {s.jumpLinks.map((item) => (
              <SmoothAnchorLink
                key={item.href}
                href={item.href}
                headerOffset={96}
                className="inline-flex min-h-[40px] items-center rounded-full border-2 border-[#1B1B1F] bg-[#FFF6E5] px-3.5 py-1 text-sm font-extrabold text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F] sticker-press touch-manipulation"
              >
                {item.label}
              </SmoothAnchorLink>
            ))}
          </nav>
        </Card>
      </ScrollReveal>

      {/* Fact vs Myth At-a-Glance */}
      <section aria-labelledby="fact-vs-myth-heading" className="mt-7">
        <h2 id="fact-vs-myth-heading" className="sr-only">
          {s.factMythSr}
        </h2>
        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StaggerItem>
            <Card color="sunshine" padding="md" shadow="md" className="h-full">
              <Sticker color="mint" tilt="left" size="sm">
                {s.factBadge}
              </Sticker>
              <h3 className="mt-3 font-display text-xl sm:text-2xl text-[#1B1B1F]">
                {s.factTitle}
              </h3>
              <p className="mt-2 text-base font-medium leading-7 text-[#1B1B1F]">
                {s.factBody}
              </p>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card color="bubblegum" padding="md" shadow="md" className="h-full">
              <Sticker color="white" tilt="right" size="sm">
                {s.mythBadge}
              </Sticker>
              <h3 className="mt-3 font-display text-xl sm:text-2xl text-[#1B1B1F]">
                {s.mythTitle}
              </h3>
              <p className="mt-2 text-base font-medium leading-7 text-[#1B1B1F]">
                {s.mythBody}
              </p>
            </Card>
          </StaggerItem>
        </StaggerGrid>
      </section>

      {/* 4 Bite-Sized Research Panels */}
      <div className="mt-7 space-y-7">
        {/* Panel 01: Old Stories */}
        <ScrollReveal>
          <Card
            as="section"
            color="white"
            padding="lg"
            shadow="md"
            aria-labelledby="history-heading"
            className="scroll-mt-24"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <Sticker color="tangerine" tilt="left" size="sm">
                {s.panel1Badge}
              </Sticker>
              <h2
                id="history-heading"
                className="font-display text-2xl sm:text-3xl text-[#1B1B1F]"
              >
                {s.panel1Title}
              </h2>
            </div>

            <p className="mt-3 text-base sm:text-[17px] font-medium leading-7 text-[#1B1B1F] max-w-prose">
              {s.panel1IntroBefore}
              <strong className="font-extrabold">{s.panel1IntroBold}</strong>
              {s.panel1IntroAfter}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {s.humorCards.map((humor) => (
                <div
                  key={humor.name}
                  className="rounded-[16px] border-[2.5px] border-[#1B1B1F] bg-[#FFF6E5] p-3.5 shadow-[3px_3px_0_#1B1B1F]"
                >
                  <span
                    style={{ backgroundColor: humor.color }}
                    className="inline-block rounded-full border-2 border-[#1B1B1F] px-2.5 py-0.5 font-display text-sm text-[#1B1B1F]"
                  >
                    {humor.name}
                  </span>
                  <p className="mt-1.5 text-base font-medium leading-relaxed text-[#1B1B1F]">
                    {humor.summary}
                  </p>
                </div>
              ))}
            </div>

            {/* Freud side-by-side */}
            <div className="mt-5 rounded-[20px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-4 shadow-[3px_3px_0_#1B1B1F]">
              <p className="font-display text-lg text-[#1B1B1F]">
                {s.freudTitle}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-[14px] border-2 border-[#1B1B1F] bg-white p-3">
                  <p className="font-extrabold text-[#1B1B1F]">
                    {s.freudLeftTitle}
                  </p>
                  <p className="mt-1 text-base font-medium leading-relaxed text-[#1B1B1F]">
                    {s.freudLeftBody}
                  </p>
                </div>
                <div className="rounded-[14px] border-2 border-[#1B1B1F] bg-white p-3">
                  <p className="font-extrabold text-[#1B1B1F]">
                    {s.freudRightTitle}
                  </p>
                  <p className="mt-1 text-base font-medium leading-relaxed text-[#1B1B1F]">
                    {s.freudRightBody}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm font-bold text-[#1B1B1F]/85">
                {s.freudNote}
              </p>
            </div>

            <ScienceStudiesAccordion studies={s.studies.history} />
          </Card>
        </ScrollReveal>

        {/* Panel 02: Poop Colors & Shape Chart */}
        <ScrollReveal>
          <Card
            as="section"
            color="sky"
            padding="lg"
            shadow="md"
            aria-labelledby="bristol-heading"
            className="scroll-mt-24"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <Sticker color="sunshine" tilt="right" size="sm">
                {s.panel2Badge}
              </Sticker>
              <h2
                id="bristol-heading"
                className="font-display text-2xl sm:text-3xl text-[#1B1B1F]"
              >
                {s.panel2Title}
              </h2>
            </div>

            <p className="mt-3 text-base sm:text-[17px] font-medium leading-7 text-[#1B1B1F] max-w-prose">
              {s.panel2IntroBefore}
              <strong className="font-extrabold">{s.panel2IntroBold}</strong>
              {s.panel2IntroAfter}
            </p>

            {/* Compact Color Legend */}
            <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {s.colorGuide.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start gap-3 rounded-[16px] border-[2.5px] border-[#1B1B1F] bg-white p-3.5 shadow-[3px_3px_0_#1B1B1F]"
                >
                  <span
                    aria-hidden="true"
                    style={{ backgroundColor: item.swatch }}
                    className="mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-[#1B1B1F]"
                  />
                  <div>
                    <p className="text-base font-extrabold leading-tight text-[#1B1B1F]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm sm:text-base font-medium leading-snug text-[#1B1B1F]">
                      {item.meaning}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* 1-to-7 Shape Chart Quick Strip */}
            <div className="mt-5 rounded-[20px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-4 shadow-[3px_3px_0_#1B1B1F]">
              <p className="font-display text-lg text-[#1B1B1F]">
                {s.bristolTitle}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {s.bristolBuckets.map((bucket) => (
                  <div
                    key={bucket.range}
                    style={{ backgroundColor: bucket.bg }}
                    className="rounded-[14px] border-2 border-[#1B1B1F] p-2.5 text-center shadow-[2px_2px_0_#1B1B1F]"
                  >
                    <p className="font-display text-base text-[#1B1B1F]">
                      {bucket.range}
                    </p>
                    <p className="text-sm font-extrabold text-[#1B1B1F]">
                      {bucket.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-[#1B1B1F]">
                {s.bristolChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border-2 border-[#1B1B1F] bg-white px-3 py-1"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <ScienceStudiesAccordion studies={s.studies.bristol} />
          </Card>
        </ScrollReveal>

        {/* Panel 03: Tiny Tummy Bugs */}
        <ScrollReveal>
          <Card
            as="section"
            color="grape"
            padding="lg"
            shadow="md"
            aria-labelledby="microbiome-heading"
            className="scroll-mt-24"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <Sticker color="mint" tilt="left" size="sm">
                {s.panel3Badge}
              </Sticker>
              <h2
                id="microbiome-heading"
                className="font-display text-2xl sm:text-3xl text-[#1B1B1F]"
              >
                {s.panel3Title}
              </h2>
            </div>

            <p className="mt-3 text-base sm:text-[17px] font-medium leading-7 text-[#1B1B1F] max-w-prose">
              {s.panel3IntroBefore}
              <strong className="font-extrabold">{s.panel3IntroBold}</strong>
              {s.panel3IntroAfter}
            </p>

            <ScienceStudiesAccordion studies={s.studies.microbiome} />
          </Card>
        </ScrollReveal>

        {/* Panel 04: Sensitive Tummies & Worries */}
        <ScrollReveal>
          <Card
            as="section"
            color="tangerine"
            padding="lg"
            shadow="md"
            aria-labelledby="ibs-heading"
            className="scroll-mt-24"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <Sticker color="white" tilt="right" size="sm">
                {s.panel4Badge}
              </Sticker>
              <h2
                id="ibs-heading"
                className="font-display text-2xl sm:text-3xl text-[#1B1B1F]"
              >
                {s.panel4Title}
              </h2>
            </div>

            <p className="mt-3 text-base sm:text-[17px] font-medium leading-7 text-[#1B1B1F] max-w-prose">
              {s.panel4IntroBefore}
              <strong className="font-extrabold">{s.panel4IntroBold}</strong>
              {s.panel4IntroAfter}
            </p>

            <ScienceStudiesAccordion studies={s.studies.ibs} />
          </Card>
        </ScrollReveal>

        {/* Closing Takeaway Panel */}
        <ScrollReveal>
          <Card
            as="section"
            color="sunshine"
            padding="lg"
            shadow="lg"
            aria-labelledby="takeaway-heading"
            className="scroll-mt-24"
          >
            <Sticker color="white" tilt="left" size="sm">
              {s.takeawayBadge}
            </Sticker>
            <h2
              id="takeaway-heading"
              className="mt-3 font-display text-2xl sm:text-3xl text-[#1B1B1F]"
            >
              {s.takeawayTitle}
            </h2>

            <ul className="mt-4 space-y-2.5 text-base sm:text-[17px] font-medium leading-7 text-[#1B1B1F] max-w-prose">
              {s.takeawayItems.map((item) => (
                <li key={item.lead} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-0.5 shrink-0">
                    {item.icon}
                  </span>
                  <span>
                    <strong className="font-extrabold">{item.lead}</strong>{" "}
                    {item.body}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/" color="bubblegum" size="lg">
                {s.ctaAnalyzer}
              </Button>
              <Button href="/types" color="mint" size="lg">
                {s.ctaTypes}
              </Button>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </article>
  );
}
