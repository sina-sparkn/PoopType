"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Decorative floating cartoon doodles (stars, sparkles, toilet-paper roll, bubbles, tiny fly)
 * with subtle spring-damped Framer Motion scroll parallax.
 * Reduced on small mobile screens and completely hidden under prefers-reduced-motion.
 */
export function FloatingDoodles() {
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, {
    stiffness: 110,
    damping: 26,
    mass: 0.4,
  });

  const driftUpSlow = useTransform(smoothY, [0, 1800], [0, -56]);
  const driftDownSlow = useTransform(smoothY, [0, 1800], [0, 48]);
  const driftUpMedium = useTransform(smoothY, [0, 1800], [0, -84]);
  const driftRotateLeft = useTransform(smoothY, [0, 1800], [0, -18]);
  const driftRotateRight = useTransform(smoothY, [0, 1800], [0, 22]);

  return (
    <>
      {/* Three staggered pastel polka-dot layers (wiggle up/down slowly while music plays; static under reduced motion) */}
      <div
        aria-hidden="true"
        data-testid="music-dots-backdrop"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          data-testid="dot-layer-pink"
          className="absolute -inset-6 bg-dot-layer-pink"
        />
        <div
          data-testid="dot-layer-sky"
          className="absolute -inset-6 bg-dot-layer-sky"
        />
        <div
          data-testid="dot-layer-sunshine"
          className="absolute -inset-6 bg-dot-layer-sunshine"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden motion-reduce:hidden"
      >
      {/* Top-left golden star (visible on all screens, subtle opacity) */}
      <motion.div
        style={{ y: driftUpSlow, rotate: driftRotateRight }}
        className="absolute left-3 top-24 opacity-60 sm:left-8 sm:top-28 sm:opacity-80"
      >
        <svg
          width="38"
          height="38"
          viewBox="0 0 40 40"
          className="animate-doodle-float"
          style={{ animationDelay: "0s" }}
        >
          <path
            d="M20 3L24.5 14.2L36.5 15.2L27.3 23L30.2 35L20 28.5L9.8 35L12.7 23L3.5 15.2L15.5 14.2Z"
            fill="#FFD93D"
            stroke="#1B1B1F"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* Top-right cartoon toilet paper roll (tablet/desktop) */}
      <motion.div
        style={{ y: driftDownSlow, rotate: driftRotateLeft }}
        className="hidden md:block absolute right-10 top-28 opacity-80"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 52 52"
          className="animate-doodle-float"
          style={{ animationDelay: "1.4s" }}
        >
          <rect
            x="10"
            y="10"
            width="28"
            height="30"
            rx="6"
            fill="#FFFFFF"
            stroke="#1B1B1F"
            strokeWidth="2.8"
          />
          <ellipse
            cx="24"
            cy="11"
            rx="14"
            ry="5"
            fill="#FFF6E5"
            stroke="#1B1B1F"
            strokeWidth="2.8"
          />
          <ellipse cx="24" cy="11" rx="4.5" ry="2" fill="#1B1B1F" />
          <path
            d="M38 18H44V39C44 41.5 41 42 38 40V18Z"
            fill="#FFFFFF"
            stroke="#1B1B1F"
            strokeWidth="2.8"
            strokeLinejoin="round"
          />
          <line
            x1="39"
            y1="26"
            x2="43"
            y2="26"
            stroke="#1B1B1F"
            strokeWidth="2"
            strokeDasharray="2 2"
          />
        </svg>
      </motion.div>

      {/* Mid-left mint bubble cluster (desktop) */}
      <motion.div
        style={{ y: driftUpMedium }}
        className="hidden lg:block absolute left-10 top-[54%] opacity-75"
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          className="animate-doodle-float"
          style={{ animationDelay: "2.3s" }}
        >
          <circle
            cx="18"
            cy="24"
            r="12"
            fill="#6BE3B5"
            stroke="#1B1B1F"
            strokeWidth="2.8"
          />
          <circle cx="14" cy="20" r="3" fill="#FFFFFF" />
          <circle
            cx="34"
            cy="14"
            r="6"
            fill="#5CC8FF"
            stroke="#1B1B1F"
            strokeWidth="2.5"
          />
        </svg>
      </motion.div>

      {/* Mid-right tiny cartoon fly (desktop) */}
      <motion.div
        style={{ y: driftUpSlow, rotate: driftRotateLeft }}
        className="hidden lg:block absolute right-14 top-[58%] opacity-75"
      >
        <svg
          width="42"
          height="34"
          viewBox="0 0 46 36"
          className="animate-doodle-float"
          style={{ animationDelay: "3.1s" }}
        >
          <ellipse
            cx="18"
            cy="12"
            rx="7"
            ry="4.5"
            transform="rotate(-24 18 12)"
            fill="#FFFFFF"
            stroke="#1B1B1F"
            strokeWidth="2.4"
          />
          <ellipse
            cx="28"
            cy="12"
            rx="7"
            ry="4.5"
            transform="rotate(24 28 12)"
            fill="#FFFFFF"
            stroke="#1B1B1F"
            strokeWidth="2.4"
          />
          <ellipse cx="23" cy="21" rx="8" ry="6" fill="#1B1B1F" />
          <circle cx="19" cy="19" r="2.2" fill="#FFFFFF" />
          <circle cx="25" cy="19" r="2.2" fill="#FFFFFF" />
        </svg>
      </motion.div>

      {/* Bottom-left sparkle (visible subtly on mobile too) */}
      <motion.div
        style={{ y: driftDownSlow, rotate: driftRotateRight }}
        className="absolute right-4 bottom-32 opacity-60 sm:left-16 sm:right-auto sm:bottom-24 sm:opacity-80"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 36 36"
          className="animate-doodle-float"
          style={{ animationDelay: "1.9s" }}
        >
          <path
            d="M18 3C19.5 12 24 16.5 33 18C24 19.5 19.5 24 18 33C16.5 24 12 19.5 3 18C12 16.5 16.5 12 18 3Z"
            fill="#FF7AC6"
            stroke="#1B1B1F"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      </div>
    </>
  );
}
