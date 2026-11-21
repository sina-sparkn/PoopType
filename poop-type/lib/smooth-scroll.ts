import { animate } from "framer-motion";

export interface ScrollTargetMetrics {
  elementTop: number;
  currentScrollY: number;
  headerOffset?: number;
  maxScrollY?: number;
}

/**
 * Pure calculation for the destination scrollY coordinate of a target element,
 * accounting for the sticky header height and document bounds.
 */
export function computeScrollTargetY({
  elementTop,
  currentScrollY,
  headerOffset = 88,
  maxScrollY = Number.POSITIVE_INFINITY,
}: ScrollTargetMetrics): number {
  const rawTarget = currentScrollY + elementTop - headerOffset;
  const clampedLow = Math.max(0, rawTarget);
  return Math.min(clampedLow, Math.max(0, maxScrollY));
}

/**
 * Computes a snappy yet buttery duration (seconds) proportional to scroll distance.
 * Returns 0 when prefersReducedMotion is enabled.
 */
export function computeScrollDuration(
  distancePx: number,
  prefersReducedMotion = false
): number {
  if (prefersReducedMotion) return 0;
  const abs = Math.abs(distancePx);
  if (abs < 4) return 0;
  // Scale between 0.38s (short jumps) and 0.85s (long page jumps)
  const scaled = 0.34 + Math.min(abs, 2400) / 4800;
  return Number(Math.min(0.85, Math.max(0.38, scaled)).toFixed(3));
}

let activeScrollStop: (() => void) | null = null;

function cancelActiveScroll() {
  if (activeScrollStop) {
    activeScrollStop();
    activeScrollStop = null;
  }
}

/**
 * Smoothly animates window scroll position using Framer Motion's `animate()`
 * with an ease-out cubic curve. Cancels automatically on user wheel/touch input
 * and jumps instantaneously under `prefers-reduced-motion: reduce`.
 */
export function smoothScrollToY(targetY: number): void {
  if (typeof window === "undefined") return;

  cancelActiveScroll();

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const maxScrollY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const clampedTarget = Math.min(Math.max(0, targetY), maxScrollY);
  const startY = window.scrollY;
  const duration = computeScrollDuration(
    clampedTarget - startY,
    prefersReduced
  );

  if (duration === 0) {
    window.scrollTo({ top: clampedTarget, behavior: "auto" });
    return;
  }

  const controls = animate(startY, clampedTarget, {
    duration,
    ease: [0.22, 1, 0.36, 1],
    onUpdate: (latest) => {
      window.scrollTo({ top: latest, behavior: "auto" });
    },
    onComplete: () => {
      cleanupListeners();
      activeScrollStop = null;
    },
  });

  const onUserInterrupt = () => {
    controls.stop();
    cleanupListeners();
    activeScrollStop = null;
  };

  const cleanupListeners = () => {
    window.removeEventListener("wheel", onUserInterrupt);
    window.removeEventListener("touchstart", onUserInterrupt);
    window.removeEventListener("keydown", onUserInterrupt);
  };

  window.addEventListener("wheel", onUserInterrupt, { passive: true });
  window.addEventListener("touchstart", onUserInterrupt, { passive: true });
  window.addEventListener("keydown", onUserInterrupt, { passive: true });

  activeScrollStop = () => {
    controls.stop();
    cleanupListeners();
  };
}

export function smoothScrollToElement(
  elementId: string,
  headerOffset = 88
): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return false;
  }
  const el = document.getElementById(elementId);
  if (!el) return false;

  const rect = el.getBoundingClientRect();
  const maxScrollY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const targetY = computeScrollTargetY({
    elementTop: rect.top,
    currentScrollY: window.scrollY,
    headerOffset,
    maxScrollY,
  });

  smoothScrollToY(targetY);
  return true;
}

export function smoothScrollToTop(): void {
  smoothScrollToY(0);
}
