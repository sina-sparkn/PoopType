"use client";

import Link from "next/link";
import { PoopMascot } from "@/components/mascot/PoopMascot";
import { useLanguage } from "@/components/LanguageProvider";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 mt-16 border-t-[3px] border-[#1B1B1F] bg-[#FFD93D] pt-10 pb-bottom-tab-clearance">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4 max-w-2xl">
            <PoopMascot
              size={64}
              mood="shy"
              code="PPLO"
              animated={false}
              className="hidden sm:block"
            />
            <div className="space-y-1.5">
              <p className="font-display text-xl text-[#1B1B1F]">
                {t.footer.disclaimer}
              </p>
              <p className="text-base font-semibold text-[#1B1B1F]/90">
                {t.footer.privacy}
              </p>
            </div>
          </div>

          <nav
            aria-label={t.footer.navAria}
            className="flex flex-wrap items-center gap-3"
          >
            {[
              { href: "/", label: t.footer.linkAnalyzer },
              { href: "/types", label: t.footer.linkTypes },
              { href: "/science", label: t.footer.linkScience },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[48px] items-center rounded-full border-[3px] border-[#1B1B1F] bg-[#FFF6E5] px-4 py-2 font-display text-base text-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F] sticker-press whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
