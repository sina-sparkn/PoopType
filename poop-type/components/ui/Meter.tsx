"use client";

import { motion } from "framer-motion";
import { CANDY_ACCENT_HEX, CandyColor } from "@/lib/theme";

interface MeterProps {
  value: number; // 0..100
  color?: CandyColor;
  label?: string;
  valueText?: string;
  emoji?: string;
  helperText?: string;
  delay?: number;
  scrollTriggered?: boolean;
}

export function Meter({
  value,
  color = "mint",
  label,
  valueText,
  emoji,
  helperText,
  delay = 0,
  scrollTriggered = false,
}: MeterProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const fillHex = CANDY_ACCENT_HEX[color];
  const targetScale = Math.max(0.06, clamped / 100);

  return (
    <div className="w-full">
      {(label || valueText) && (
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          {label && (
            <span className="font-display text-lg text-[#1B1B1F] flex items-center gap-1.5">
              {emoji && <span aria-hidden="true">{emoji}</span>}
              <span>{label}</span>
            </span>
          )}
          {valueText && (
            <span className="font-display text-lg text-[#1B1B1F] tabular-nums">
              {valueText}
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
        className="h-6 w-full overflow-hidden rounded-full border-[3px] border-[#1B1B1F] bg-[#FFF6E5] shadow-[3px_3px_0_#1B1B1F]"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={scrollTriggered ? undefined : { scaleX: targetScale }}
          whileInView={scrollTriggered ? { scaleX: targetScale } : undefined}
          viewport={scrollTriggered ? { once: true, amount: "some" } : undefined}
          transition={{
            duration: 0.55,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            transformOrigin: "left center",
            backgroundColor: fillHex,
          }}
          className="h-full w-full rounded-full border-r-[3px] border-[#1B1B1F]"
        />
      </div>

      {helperText && (
        <p className="mt-1.5 text-sm font-semibold text-[#1B1B1F]/80">
          {helperText}
        </p>
      )}
    </div>
  );
}
