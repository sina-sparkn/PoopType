"use client";

import React, { useEffect } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { smoothScrollToElement } from "@/lib/smooth-scroll";

export const SMOOTH_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 420,
  damping: 32,
  mass: 0.7,
};

export const SPRING_BOUNCY = {
  type: "spring" as const,
  stiffness: 340,
  damping: 24,
};

const REVEAL_VIEWPORT = {
  once: true,
  amount: 0.01 as const,
  margin: "120px 0px 120px 0px",
};

/**
 * Candy-colored spring-smoothed scroll progress indicator docked along the bottom
 * edge of the sticky header. Resets cleanly on route change.
 */
export function ScrollProgressBar() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 34,
    restDelta: 0.001,
  });

  useEffect(() => {
    smoothProgress.jump(0);
  }, [pathname, smoothProgress]);

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -bottom-[3px] h-[4px] overflow-hidden bg-transparent"
    >
      <motion.div
        data-testid="scroll-progress-bar"
        style={{
          scaleX: smoothProgress,
          transformOrigin: "0% 50%",
        }}
        className="h-full w-full bg-gradient-to-r from-[#FF7AC6] via-[#FFD93D] to-[#6BE3B5]"
      />
    </div>
  );
}

/**
 * Smooth entrance transition whenever the active Next.js App Router pathname changes.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className="w-full">{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: SMOOTH_EASE }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
  scale?: number;
  immediate?: boolean;
  children: React.ReactNode;
}

/**
 * GPU-composited scroll-triggered entrance animation.
 * Uses a generous positive vertical margin so cards begin gliding in smoothly
 * right as they approach the viewport, avoiding blank gaps during fast scrolls.
 */
export function ScrollReveal({
  delay = 0,
  y = 14,
  scale = 1,
  immediate = false,
  className = "",
  children,
  ...rest
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  if (immediate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: Math.min(y, 12), scale }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, delay, ease: SMOOTH_EASE }}
        className={className}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: 0.36, delay, ease: SMOOTH_EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface StaggerGridProps {
  className?: string;
  staggerDelay?: number;
  immediate?: boolean;
  children: React.ReactNode;
}

export function StaggerGrid({
  className = "",
  staggerDelay = 0.045,
  immediate = false,
  children,
}: StaggerGridProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  if (immediate) {
    return (
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.3, ease: SMOOTH_EASE },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * In-page anchor link powered by Framer Motion smooth scroll with sticky header offset.
 */
export function SmoothAnchorLink({
  href,
  className = "",
  headerOffset = 92,
  children,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  headerOffset?: number;
}) {
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    rest.onClick?.(e);
    if (e.defaultPrevented) return;
    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (smoothScrollToElement(id, headerOffset)) {
        e.preventDefault();
        if (window.location.hash !== href) {
          window.history.replaceState(null, "", href);
        }
      }
    }
  };

  return (
    <a href={href} className={className} {...rest} onClick={handleClick}>
      {children}
    </a>
  );
}
