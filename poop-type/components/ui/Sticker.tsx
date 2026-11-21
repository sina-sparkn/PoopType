import { CANDY_SURFACE_CLASSES, CandyColor } from "@/lib/theme";

interface StickerProps {
  color?: CandyColor | "white";
  tilt?: "none" | "left" | "right" | "strong-left" | "strong-right";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}

const TILT_CLASSES: Record<NonNullable<StickerProps["tilt"]>, string> = {
  none: "",
  left: "-rotate-2",
  right: "rotate-2",
  "strong-left": "-rotate-3",
  "strong-right": "rotate-3",
};

export function Sticker({
  color = "sunshine",
  tilt = "none",
  size = "md",
  className = "",
  children,
}: StickerProps) {
  const bgClass =
    color === "white"
      ? "bg-white text-[#1B1B1F]"
      : CANDY_SURFACE_CLASSES[color];

  const sizeClass =
    size === "sm"
      ? "px-3 py-1 text-sm font-bold"
      : "px-3.5 py-1.5 text-sm sm:text-base font-extrabold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-[3px] border-[#1B1B1F] shadow-[3px_3px_0_#1B1B1F] ${bgClass} ${sizeClass} ${TILT_CLASSES[tilt]} ${className}`}
    >
      {children}
    </span>
  );
}
