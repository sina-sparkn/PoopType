"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher, useLanguage } from "@/components/LanguageProvider";
import {
  ScrollProgressBar,
  SPRING_SNAPPY,
} from "@/components/motion/MotionPrimitives";
import { playKawaiiSfx } from "@/lib/kawaii-sfx";

export function SiteHeader() {
  const pathname = usePathname();
  const { lang, t } = useLanguage();

  const logoSrc =
    lang === "fa"
      ? "/assets/aistudio/Kawaii_Poop_Type_Persian_Sticker_Logo_99946bd4.png"
      : "/assets/aistudio/Kawaii_PoopType_Sticker_Logo_e3f3f15e.png";

  const navLinks = [
    { href: "/", label: t.nav.analyze },
    { href: "/types", label: t.nav.types },
    { href: "/science", label: t.nav.science },
  ];

  return (
    <header
      className="sticky top-0 z-30 w-full border-b-[3px] border-[#1B1B1F] bg-[#FFF6E5]/95 backdrop-blur-sm"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex h-16 md:h-20 max-w-6xl items-center justify-between gap-2 lg:gap-4 px-3.5 sm:px-5 lg:px-8">
        {/* Top bar brand logo (localized EN / FA sticker logo) */}
        <Link
          href="/"
          onClick={() => playKawaiiSfx("pop")}
          aria-label={t.brandName}
          data-testid="site-header-logo"
          className="inline-flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7AC6]/60 rounded-2xl"
        >
          <motion.span
            whileHover={{ rotate: [-3, 3, 0], scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{
              rotate: { type: "tween", duration: 0.36, ease: "easeInOut" },
              scale: SPRING_SNAPPY,
            }}
            className="inline-flex items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt={t.brandName}
              width={lang === "fa" ? 1536 : 1535}
              height={1024}
              draggable={false}
              className="h-14 sm:h-16 md:h-[72px] w-auto object-contain select-none drop-shadow-[0_2px_0_rgba(27,27,31,0.14)]"
            />
          </motion.span>
        </Link>

        {/* Mobile compact controls: privacy badge (hidden on ultra-narrow) + language switcher */}
        <div className="md:hidden flex items-center gap-2 shrink-0">
          <span className="hidden xs:inline-flex sm:inline-flex items-center gap-1 rounded-full border-[2.5px] border-[#1B1B1F] bg-[#6BE3B5] px-2.5 py-1 text-xs font-extrabold text-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F] whitespace-nowrap shrink-0">
            <span aria-hidden="true">🔒</span> {t.nav.mobilePrivacyChip}
          </span>
          <LanguageSwitcher compact testId="lang-switcher-mobile" />
        </div>

        {/* Desktop pill-shaped navigation with smooth horizontal active pill */}
        <LayoutGroup id="desktop-nav">
          <nav
            aria-label={t.nav.primaryNavAria}
            className="hidden md:flex relative items-center gap-1 lg:gap-1.5 overflow-hidden rounded-full border-[3px] border-[#1B1B1F] bg-white p-1 lg:p-1.5 shadow-[4px_4px_0_#1B1B1F]"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/" || pathname.startsWith("/result")
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => playKawaiiSfx("pop")}
                  className="relative inline-flex min-h-[40px] items-center rounded-full px-3.5 lg:px-5 py-1.5 font-display text-base tracking-wide text-[#1B1B1F] whitespace-nowrap shrink-0 hover:bg-[#FFF6E5]/70 transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="desktop-nav-pill"
                      layout="position"
                      layoutDependency={pathname}
                      transition={SPRING_SNAPPY}
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[#FFD93D] border-2 border-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F]"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>

        {/* Desktop language toggle + chunky primary CTA */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <LanguageSwitcher testId="lang-switcher" />
          <Button
            href="/#analyzer"
            color="bubblegum"
            size="md"
            className="px-4 lg:px-5"
          >
            <span aria-hidden="true">📸</span> {t.nav.ctaPhoto}
          </Button>
        </div>
      </div>

      {/* Smooth scroll progress indicator */}
      <ScrollProgressBar />
    </header>
  );
}
