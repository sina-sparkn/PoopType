"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { smoothScrollToTop } from "@/lib/smooth-scroll";
import {
  applyScrollPosition,
  BackToTopState,
  createInitialBackToTopState,
  recordDownwardGesture,
} from "@/lib/back-to-top";
import { SPRING_SNAPPY } from "@/components/motion/MotionPrimitives";
import { playKawaiiSfx } from "@/lib/kawaii-sfx";

function getScrollMetrics() {
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const viewportHeight = window.innerHeight || 0;
  const maxScrollY = Math.max(
    0,
    document.documentElement.scrollHeight - viewportHeight
  );
  return { scrollY, viewportHeight, maxScrollY };
}

/**
 * Floating Back-to-Top sticker button rendered globally across all tabs.
 * Appears smoothly after three downward scrolls and stays clear of both
 * the mobile bottom tab bar and RTL layouts.
 */
export function BackToTopButton() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const stateRef = useRef<BackToTopState>(createInitialBackToTopState());
  const touchStartYRef = useRef<number | null>(null);
  const [visibility, setVisibility] = useState<{
    pathname: string;
    visible: boolean;
  }>({ pathname, visible: false });

  const visible = visibility.pathname === pathname && visibility.visible;

  useEffect(() => {
    // Reset scroll-gesture count when switching tabs / routes
    const { scrollY, viewportHeight, maxScrollY } = getScrollMetrics();
    const initial = applyScrollPosition(createInitialBackToTopState(), {
      scrollY,
      viewportHeight,
      maxScrollY,
    });
    stateRef.current = initial;

    const syncVisibility = (next: BackToTopState) => {
      stateRef.current = next;
      setVisibility((prev) =>
        prev.pathname === pathname && prev.visible === next.visible
          ? prev
          : { pathname, visible: next.visible }
      );
    };

    const handleScroll = () => {
      const metrics = getScrollMetrics();
      const next = applyScrollPosition(stateRef.current, metrics);
      syncVisibility(next);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0) return;
      const metrics = getScrollMetrics();
      const next = recordDownwardGesture(stateRef.current, {
        nowMs: Date.now(),
        ...metrics,
      });
      syncVisibility(next);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        touchStartYRef.current = event.touches[0].clientY;
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const startY = touchStartYRef.current;
      touchStartYRef.current = null;
      if (startY === null || event.changedTouches.length === 0) return;
      const endY = event.changedTouches[0].clientY;
      // Swiping finger upward scrolls the page downward
      if (startY - endY > 24) {
        const metrics = getScrollMetrics();
        const next = recordDownwardGesture(stateRef.current, {
          nowMs: Date.now(),
          ...metrics,
        });
        syncVisibility(next);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) {
        return;
      }
      if (
        event.key === "PageDown" ||
        event.key === "ArrowDown" ||
        (event.key === " " && !event.shiftKey)
      ) {
        const metrics = getScrollMetrics();
        const next = recordDownwardGesture(stateRef.current, {
          nowMs: Date.now(),
          ...metrics,
        });
        syncVisibility(next);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="back-to-top"
          type="button"
          onClick={() => {
            playKawaiiSfx("whooshUp");
            smoothScrollToTop();
          }}
          aria-label={t.nav.backToTopAria}
          title={t.nav.backToTopAria}
          data-testid="back-to-top-button"
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.78, y: 18 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.78, y: 18 }
          }
          whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.05 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
          transition={SPRING_SNAPPY}
          className="fixed z-30 end-4 bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] md:bottom-7 md:end-7 inline-flex h-[52px] min-w-[52px] sm:h-12 sm:px-4 items-center justify-center gap-1.5 rounded-full border-[3px] border-[#1B1B1F] bg-[#FFD93D] text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation select-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF7AC6]/70"
        >
          <ArrowUp
            className="h-5 w-5 shrink-0"
            strokeWidth={2.75}
            aria-hidden="true"
          />
          <span className="hidden sm:inline font-display text-base tracking-wide">
            {t.nav.backToTopLabel}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
