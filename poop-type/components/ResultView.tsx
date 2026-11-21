"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PortfolioAnalysisResult } from "@/lib/analyze";
import { renderShareCardPng } from "@/lib/share-card";
import {
  getEmptyPreviews,
  getSessionPreviews,
  subscribeSessionPreviews,
} from "@/lib/session-store";
import { AXIS_TILE_COLORS, CandyColor, TYPE_CARD_COLORS } from "@/lib/theme";
import { PoopMascot } from "@/components/mascot/PoopMascot";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { Meter } from "@/components/ui/Meter";
import { ConfettiCanvas } from "@/components/ui/ConfettiCanvas";
import {
  ScrollReveal,
  SMOOTH_EASE,
} from "@/components/motion/MotionPrimitives";
import { useLanguage } from "@/components/LanguageProvider";
import { formatTemplate, type TranslationDictionary } from "@/lib/i18n";

interface ResultViewProps {
  result: PortfolioAnalysisResult;
}

type RevealStage = "drumroll" | "tiles" | "revealed";

const BIG_FIVE_STYLES: Array<{
  key: keyof PortfolioAnalysisResult["bigFive"];
  emoji: string;
  color: CandyColor;
}> = [
  { key: "openness", emoji: "🧠", color: "bubblegum" },
  { key: "conscientiousness", emoji: "📋", color: "sunshine" },
  { key: "extraversion", emoji: "🎉", color: "mint" },
  { key: "agreeableness", emoji: "🤝", color: "sky" },
  { key: "neuroticism", emoji: "😬", color: "tangerine" },
];

function decodeAxisBadges(code: string, axes: TranslationDictionary["axes"]) {
  const [form, outline, tone, sheen] = axes;
  return [
    {
      letter: code[0],
      axis: form.name,
      label: code[0] === "P" ? form.left.label : form.right.label,
      color: AXIS_TILE_COLORS[0],
    },
    {
      letter: code[1],
      axis: outline.name,
      label: code[1] === "P" ? outline.left.label : outline.right.label,
      color: AXIS_TILE_COLORS[1],
    },
    {
      letter: code[2],
      axis: tone.name,
      label: code[2] === "T" ? tone.left.label : tone.right.label,
      color: AXIS_TILE_COLORS[2],
    },
    {
      letter: code[3],
      axis: sheen.name,
      label: code[3] === "O" ? sheen.left.label : sheen.right.label,
      color: AXIS_TILE_COLORS[3],
    },
  ];
}

const emptySubscribe = () => () => {};

export function ResultView({ result }: ResultViewProps) {
  const { lang, t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { profile } = result;
  const localized = t.types[result.code];
  const bristolInfo = t.bristol[result.bristolType] ?? t.bristol[4];
  const bestMatchCode = profile.bestMatch;
  const worstMatchCode = profile.worstMatch;
  const bestMatchLocalized = t.types[bestMatchCode];
  const worstMatchLocalized = t.types[worstMatchCode];
  const axes = decodeAxisBadges(result.code, t.axes);
  const heroCardColor = TYPE_CARD_COLORS[result.code];

  const sessionPreviews = useSyncExternalStore(
    subscribeSessionPreviews,
    () => getSessionPreviews(result.seedHex),
    getEmptyPreviews
  );

  // Reveal sequence: drumroll -> 4 letter tiles flip -> confetti & full card
  const [revealStage, setRevealStage] = useState<RevealStage>("drumroll");
  const [flippedCount, setFlippedCount] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);

  const [includePhotos, setIncludePhotos] = useState(false);
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const effectiveStage: RevealStage =
    isHydrated && prefersReducedMotion ? "revealed" : revealStage;

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        setRevealStage("tiles");
        setFlippedCount(1);
      }, 780)
    );
    timers.push(window.setTimeout(() => setFlippedCount(2), 1060));
    timers.push(window.setTimeout(() => setFlippedCount(3), 1340));
    timers.push(window.setTimeout(() => setFlippedCount(4), 1620));
    timers.push(
      window.setTimeout(() => {
        setRevealStage("revealed");
        setConfettiActive(true);
        if (
          typeof navigator !== "undefined" &&
          typeof navigator.vibrate === "function"
        ) {
          try {
            navigator.vibrate([30, 40, 60]);
          } catch {
            // Haptics unavailable or blocked
          }
        }
      }, 2080)
    );

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [prefersReducedMotion, result.code, result.seedHex]);

  // Generate client-side PNG share card whenever result, language, or opt-in toggle changes
  useEffect(() => {
    let cancelled = false;
    renderShareCardPng(result, {
      includePhotos: includePhotos && sessionPreviews.length > 0,
      sanitizedPreviews: sessionPreviews,
      lang,
    })
      .then((url) => {
        if (!cancelled) {
          setCardDataUrl(url);
        }
      })
      .catch(() => {
        // Fallback handled cleanly
      });

    return () => {
      cancelled = true;
    };
  }, [includePhotos, lang, result, sessionPreviews]);

  const handleCopyLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareFeedback(t.result.feedbackCopied);
    } catch {
      setShareFeedback(formatTemplate(t.result.feedbackCopyFallback, { url }));
    }
    window.setTimeout(() => setShareFeedback(null), 4000);
  }, [t.result.feedbackCopied, t.result.feedbackCopyFallback]);

  const handleWebShare = useCallback(async () => {
    const url = window.location.href;
    const shareTitle = formatTemplate(t.result.shareNativeTitle, {
      code: result.code,
      nickname: localized.nickname,
    });
    const shareText = formatTemplate(t.result.shareNativeText, {
      code: result.code,
      nickname: localized.nickname,
      pct: result.confidence.toFixed(1),
    });

    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function"
    ) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url,
        });
        setShareFeedback(t.result.feedbackShared);
        window.setTimeout(() => setShareFeedback(null), 3500);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
      }
    }
    await handleCopyLink();
  }, [
    handleCopyLink,
    localized.nickname,
    result.code,
    result.confidence,
    t.result.feedbackShared,
    t.result.shareNativeText,
    t.result.shareNativeTitle,
  ]);

  const handleDownloadCard = useCallback(() => {
    if (!cardDataUrl) return;
    const link = document.createElement("a");
    link.href = cardDataUrl;
    link.download = `pooptype-${result.code.toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShareFeedback(t.result.feedbackDownloaded);
    window.setTimeout(() => setShareFeedback(null), 3500);
  }, [cardDataUrl, result.code, t.result.feedbackDownloaded]);

  const handleSkipReveal = () => {
    setRevealStage("revealed");
  };

  const photoCountLabel =
    result.specimenCount === 1
      ? t.result.photoCountSingle
      : formatTemplate(t.result.photoCountPlural, {
          count: result.specimenCount,
        });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <ConfettiCanvas active={confettiActive && !prefersReducedMotion} />

      <AnimatePresence mode="wait">
        {effectiveStage === "drumroll" && (
          <motion.section
            key="drumroll-stage"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            aria-live="polite"
            data-testid="reveal-drumroll"
            className="flex min-h-[62dvh] flex-col items-center justify-center text-center"
          >
            <Card color="sunshine" padding="lg" shadow="lg" className="w-full max-w-md">
              <motion.div
                animate={{ rotate: [-4, 4, -4, 4, 0] }}
                transition={{ duration: 0.45, repeat: Infinity }}
                className="inline-block text-5xl"
                aria-hidden="true"
              >
                🥁
              </motion.div>
              <h1 className="mt-3 font-display text-3xl sm:text-4xl text-[#1B1B1F]">
                {t.result.drumrollTitle}
              </h1>
              <p className="mt-2 text-base font-bold text-[#1B1B1F]">
                {t.result.drumrollBody}
              </p>
              <div className="mt-4 flex justify-center">
                <PoopMascot mood="thinking" size={148} />
              </div>
              <div className="mt-5">
                <Button color="cream" size="md" onClick={handleSkipReveal}>
                  {t.result.skipReveal}
                </Button>
              </div>
            </Card>
          </motion.section>
        )}

        {effectiveStage === "tiles" && (
          <motion.section
            key="tiles-stage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            aria-live="polite"
            data-testid="reveal-tiles"
            className="flex min-h-[62dvh] flex-col items-center justify-center text-center"
          >
            <Card color="cream" padding="lg" shadow="lg" className="w-full max-w-lg">
              <Sticker color="bubblegum" tilt="left" className="mb-4">
                {t.result.tilesBadge}
              </Sticker>
              <div dir="ltr" className="grid grid-cols-4 gap-3 sm:gap-4">
                {axes.map((item, idx) => {
                  const isFlipped = idx < flippedCount;
                  const bgMap: Record<CandyColor, string> = {
                    bubblegum: "bg-[#FF7AC6]",
                    sunshine: "bg-[#FFD93D]",
                    mint: "bg-[#6BE3B5]",
                    sky: "bg-[#5CC8FF]",
                    grape: "bg-[#B997FF]",
                    tangerine: "bg-[#FF9F43]",
                    cream: "bg-[#FFF6E5]",
                  };
                  return (
                    <motion.div
                      key={item.axis}
                      initial={{ rotateY: 90, scale: 0.75, opacity: 0 }}
                      animate={
                        isFlipped
                          ? { rotateY: 0, scale: 1, opacity: 1 }
                          : { rotateY: 90, scale: 0.75, opacity: 0.25 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 20,
                      }}
                      className={`flex aspect-square flex-col items-center justify-center rounded-[20px] border-[3px] border-[#1B1B1F] shadow-[5px_5px_0_#1B1B1F] ${bgMap[item.color]}`}
                    >
                      <span className="font-display text-4xl sm:text-5xl text-[#1B1B1F]">
                        {isFlipped ? item.letter : "?"}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
              <p className="mt-5 font-display text-2xl text-[#1B1B1F]">
                {t.result.tilesFooter}
              </p>
            </Card>
          </motion.section>
        )}

        {effectiveStage === "revealed" && (
          <motion.div
            key="revealed-stage"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            data-testid="reveal-complete"
            className="space-y-7"
          >
            {/* Friendly Yellow Caution Sticker Vibe Alert (when triggered) */}
            {result.vibeAlert && (
              <aside
                role="note"
                aria-label={t.result.vibeAlertAria}
                className="rounded-[24px] border-[3px] border-[#1B1B1F] bg-[#FFD93D] p-5 shadow-[6px_6px_0_#1B1B1F]"
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] border-[#1B1B1F] bg-white text-xl shadow-[2px_2px_0_#1B1B1F]"
                    aria-hidden="true"
                  >
                    ⚠️
                  </span>
                  <div>
                    <p className="font-display text-xl text-[#1B1B1F]">
                      {t.result.vibeAlertTitle}
                    </p>
                    <p className="mt-1 text-base font-bold leading-relaxed text-[#1B1B1F]">
                      {t.result.vibeAlertBody}
                    </p>
                  </div>
                </div>
              </aside>
            )}

            {/* COLLECTIBLE TRADING CARD */}
            <Card
              as="section"
              color={heroCardColor}
              padding="lg"
              shadow="lg"
              aria-labelledby="result-code-heading"
            >
              {/* Top sticker metadata row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Sticker color="white" size="sm">
                  <span aria-hidden="true">📸</span> {photoCountLabel} ·{" "}
                  {t.result.codeIdLabel}{" "}
                  <span dir="ltr">{result.seedHex.slice(0, 6)}</span>
                </Sticker>
                <Sticker color="sunshine" tilt="right" size="sm">
                  {formatTemplate(t.result.confidenceLabel, {
                    pct: result.confidence.toFixed(1),
                  })}
                </Sticker>
              </div>

              {/* 4 giant colored letter tiles (always LTR so P-P-L-O reads in code order) */}
              <div
                dir="ltr"
                className="mt-6 grid grid-cols-4 gap-2.5 sm:gap-4 max-w-lg mx-auto"
              >
                {axes.map((item) => {
                  const bgMap: Record<CandyColor, string> = {
                    bubblegum: "bg-[#FF7AC6]",
                    sunshine: "bg-[#FFD93D]",
                    mint: "bg-[#6BE3B5]",
                    sky: "bg-[#5CC8FF]",
                    grape: "bg-[#B997FF]",
                    tangerine: "bg-[#FF9F43]",
                    cream: "bg-[#FFF6E5]",
                  };
                  return (
                    <div
                      key={item.axis}
                      className={`flex flex-col items-center justify-center rounded-[20px] border-[3px] border-[#1B1B1F] py-3 sm:py-4 shadow-[5px_5px_0_#1B1B1F] ${bgMap[item.color]}`}
                    >
                      <span className="font-display text-4xl sm:text-6xl leading-none text-[#1B1B1F]">
                        {item.letter}
                      </span>
                      <span className="mt-1 text-xs sm:text-sm font-extrabold text-[#1B1B1F]">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Mascot + Nickname Banner + Speech Blurb */}
              <div className="mt-6 flex flex-col items-center text-center">
                <div className="rounded-[24px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-4 shadow-[5px_5px_0_#1B1B1F]">
                  <PoopMascot
                    code={result.code}
                    mood="celebrating"
                    size={156}
                    label={`${result.code} ${localized.nickname}`}
                  />
                </div>

                <div className="mt-4 inline-block -rotate-1 rounded-[20px] border-[3px] border-[#1B1B1F] bg-white px-6 py-2.5 shadow-[5px_5px_0_#1B1B1F]">
                  <h1
                    id="result-code-heading"
                    className="font-display text-3xl sm:text-5xl text-[#1B1B1F]"
                  >
                    <span className="sr-only">{result.code}: </span>
                    {localized.nickname}
                  </h1>
                </div>

                <p className="mt-4 max-w-xl rounded-[20px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] px-5 py-4 text-base sm:text-lg font-bold text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F]">
                  {localized.blurb}
                </p>
              </div>

              {/* Shape Chart, Vibe, Habit Style Sticker Badges */}
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-[20px] border-[3px] border-[#1B1B1F] bg-white p-4 shadow-[4px_4px_0_#1B1B1F]">
                  <Sticker color="bubblegum" size="sm" tilt="left">
                    🧻 {t.result.bristolBadge}
                  </Sticker>
                  <p className="mt-2 font-display text-2xl text-[#1B1B1F]">
                    {bristolInfo.name} · {bristolInfo.shortLabel}
                  </p>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-[#1B1B1F]/85">
                    {bristolInfo.traitNote}
                  </p>
                  <div
                    dir="ltr"
                    className="mt-3 grid grid-cols-7 gap-1"
                    aria-label={`${bristolInfo.name} / 7`}
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                      <div
                        key={n}
                        className={`flex h-9 items-center justify-center rounded-xl border-2 border-[#1B1B1F] font-display text-base tabular-nums ${
                          n === result.bristolType
                            ? "bg-[#FFD93D] text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F]"
                            : "bg-[#FFF6E5] text-[#1B1B1F]/65"
                        }`}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[20px] border-[3px] border-[#1B1B1F] bg-white p-4 shadow-[4px_4px_0_#1B1B1F]">
                  <Sticker color="sunshine" size="sm" tilt="right">
                    🌟 {t.result.moodBadge}
                  </Sticker>
                  <p className="mt-2 font-display text-2xl text-[#1B1B1F]">
                    {localized.moodLabel}
                  </p>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-[#1B1B1F]/85">
                    {localized.moodNote}
                  </p>
                </div>

                <div className="rounded-[20px] border-[3px] border-[#1B1B1F] bg-white p-4 shadow-[4px_4px_0_#1B1B1F]">
                  <Sticker color="grape" size="sm" tilt="left">
                    🛋️ {t.result.styleBadge}
                  </Sticker>
                  <p className="mt-2 font-display text-2xl text-[#1B1B1F]">
                    {localized.styleLabel}
                  </p>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-[#1B1B1F]/85">
                    {localized.styleNote}
                  </p>
                </div>
              </div>
            </Card>

            {/* 5 Silly Super-Meters */}
            <ScrollReveal>
              <Card as="section" color="white" padding="lg">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-display text-3xl text-[#1B1B1F]">
                    {t.result.bigFiveTitle}
                  </h2>
                  <Sticker color="sky" size="sm">
                    {t.result.bigFiveBadge}
                  </Sticker>
                </div>

                <div className="mt-6 space-y-5">
                  {BIG_FIVE_STYLES.map((trait, index) => {
                    const traitCopy = t.result.bigFive[trait.key];
                    return (
                      <Meter
                        key={trait.key}
                        value={result.bigFive[trait.key]}
                        color={trait.color}
                        label={traitCopy.label}
                        emoji={trait.emoji}
                        valueText={`${result.bigFive[trait.key]}%`}
                        helperText={traitCopy.note}
                        delay={prefersReducedMotion ? 0 : index * 0.06}
                        scrollTriggered
                      />
                    );
                  })}
                </div>
              </Card>
            </ScrollReveal>

            {/* Superpowers (Green Stickers) & Silly Quirks (Pink Stickers) */}
            <ScrollReveal className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card as="section" color="cream" padding="md">
                <h2 className="font-display text-2xl sm:text-3xl text-[#1B1B1F]">
                  {t.result.strengthsTitle}
                </h2>
                <ul className="mt-4 space-y-3">
                  {localized.strengths.map((strength, i) => (
                    <li
                      key={strength}
                      className={`rounded-[18px] border-[3px] border-[#1B1B1F] bg-[#6BE3B5] px-4 py-3 text-base font-extrabold text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] ${
                        i % 2 === 0 ? "-rotate-1" : "rotate-1"
                      }`}
                    >
                      ✅ {strength}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card as="section" color="cream" padding="md">
                <h2 className="font-display text-2xl sm:text-3xl text-[#1B1B1F]">
                  {t.result.flawsTitle}
                </h2>
                <ul className="mt-4 space-y-3">
                  {localized.flaws.map((flaw, i) => (
                    <li
                      key={flaw}
                      className={`rounded-[18px] border-[3px] border-[#1B1B1F] bg-[#FF7AC6] px-4 py-3 text-base font-extrabold text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] ${
                        i % 2 === 0 ? "rotate-1" : "-rotate-1"
                      }`}
                    >
                      💥 {flaw}
                    </li>
                  ))}
                </ul>
              </Card>
            </ScrollReveal>

            {/* Fun Story Speech Bubble */}
            <ScrollReveal>
              <Card as="section" color="sunshine" padding="md">
                <Sticker color="white" size="sm" tilt="left">
                  🎭 {t.result.famousBadge}
                </Sticker>
                <p className="mt-3 font-display text-2xl sm:text-3xl leading-snug text-[#1B1B1F]">
                  &ldquo;{localized.famousFor}&rdquo;
                </p>
              </Card>
            </ScrollReveal>

            {/* Best & Funny Opposite Mini Trading Cards with Mascots */}
            <ScrollReveal>
              <section aria-labelledby="matches-heading">
                <h2
                  id="matches-heading"
                  className="font-display text-3xl text-[#1B1B1F] mb-4"
                >
                  {t.result.matchesTitle}
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Link
                    href={`/result/${bestMatchCode}`}
                    className="flex items-center gap-4 rounded-[24px] border-[3px] border-[#1B1B1F] bg-[#6BE3B5] p-5 shadow-[6px_6px_0_#1B1B1F] sticker-press"
                  >
                    <div className="rounded-[18px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-2 shadow-[3px_3px_0_#1B1B1F]">
                      <PoopMascot
                        code={bestMatchCode}
                        mood="celebrating"
                        size={78}
                      />
                    </div>
                    <div>
                      <Sticker color="white" size="sm">
                        💚 {t.result.bestMatch}
                      </Sticker>
                      <p
                        dir="ltr"
                        className="mt-1.5 font-display text-3xl text-[#1B1B1F]"
                      >
                        {bestMatchCode}
                      </p>
                      <p className="text-base font-extrabold text-[#1B1B1F]">
                        {bestMatchLocalized.nickname} →
                      </p>
                    </div>
                  </Link>

                  <Link
                    href={`/result/${worstMatchCode}`}
                    className="flex items-center gap-4 rounded-[24px] border-[3px] border-[#1B1B1F] bg-[#FF7AC6] p-5 shadow-[6px_6px_0_#1B1B1F] sticker-press"
                  >
                    <div className="rounded-[18px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-2 shadow-[3px_3px_0_#1B1B1F]">
                      <PoopMascot
                        code={worstMatchCode}
                        mood="shy"
                        size={78}
                      />
                    </div>
                    <div>
                      <Sticker color="white" size="sm">
                        ⚡ {t.result.worstMatch}
                      </Sticker>
                      <p
                        dir="ltr"
                        className="mt-1.5 font-display text-3xl text-[#1B1B1F]"
                      >
                        {worstMatchCode}
                      </p>
                      <p className="text-base font-extrabold text-[#1B1B1F]">
                        {worstMatchLocalized.nickname} →
                      </p>
                    </div>
                  </Link>
                </div>
              </section>
            </ScrollReveal>

            {/* Shareable Cartoon PNG Card + Opt-in Photo Toggle */}
            <ScrollReveal>
              <Card
                as="section"
                color="sky"
                padding="lg"
                aria-labelledby="share-heading"
              >
                <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <Sticker color="sunshine" size="sm" tilt="left">
                      🖼️ {t.result.shareBadge}
                    </Sticker>
                    <h2
                      id="share-heading"
                      className="font-display text-3xl text-[#1B1B1F]"
                    >
                      {t.result.shareTitle}
                    </h2>
                    <p className="text-base font-bold text-[#1B1B1F]">
                      {t.result.shareBody}
                    </p>

                    {/* Opt-in photo toggle (OFF by default!) */}
                    <div className="rounded-[18px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-4 shadow-[4px_4px_0_#1B1B1F]">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includePhotos}
                          disabled={sessionPreviews.length === 0}
                          onChange={(e) => setIncludePhotos(e.target.checked)}
                          className="mt-1 h-5 w-5 rounded border-[2.5px] border-[#1B1B1F] accent-[#1B1B1F] disabled:cursor-not-allowed"
                        />
                        <span className="text-base text-[#1B1B1F]">
                          <span className="font-extrabold block">
                            {t.result.includePhotosTitle}
                          </span>
                          <span className="block mt-0.5 text-sm font-semibold text-[#1B1B1F]/80">
                            {sessionPreviews.length > 0
                              ? formatTemplate(t.result.includePhotosReady, {
                                  count: sessionPreviews.length,
                                })
                              : t.result.includePhotosUnavailable}
                          </span>
                        </span>
                      </label>
                    </div>

                    {/* Chunky 2x2 action buttons (>= 48px touch targets) */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Button
                        color="sunshine"
                        size="md"
                        fullWidth
                        onClick={handleWebShare}
                      >
                        <span aria-hidden="true">🚀</span> {t.result.btnShare}
                      </Button>
                      <Button
                        color="cream"
                        size="md"
                        fullWidth
                        onClick={handleCopyLink}
                      >
                        <span aria-hidden="true">🔗</span> {t.result.btnCopy}
                      </Button>
                      <Button
                        color="mint"
                        size="md"
                        fullWidth
                        onClick={handleDownloadCard}
                        disabled={!cardDataUrl}
                      >
                        <span aria-hidden="true">🖼️</span> {t.result.btnDownload}
                      </Button>
                      <Button href="/" color="bubblegum" size="md" fullWidth>
                        <span aria-hidden="true">💩</span> {t.result.btnTryAgain}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {shareFeedback && (
                        <motion.p
                          role="status"
                          aria-live="polite"
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -4, scale: 0.97 }}
                          transition={{ duration: 0.2, ease: SMOOTH_EASE }}
                          className="rounded-xl border-[2.5px] border-[#1B1B1F] bg-[#FFF6E5] px-4 py-2 text-sm font-extrabold text-[#1B1B1F]"
                        >
                          {shareFeedback}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="rounded-[22px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-3 shadow-[5px_5px_0_#1B1B1F]">
                      {cardDataUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cardDataUrl}
                          alt={formatTemplate(t.result.cardImgAlt, {
                            code: result.code,
                            nickname: localized.nickname,
                          })}
                          className="h-auto w-full rounded-[14px] border-2 border-[#1B1B1F]"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center font-display text-xl text-[#1B1B1F]">
                          {t.result.drawingCard}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
