import { CANDY_SURFACE_CLASSES, CandyColor } from "@/lib/theme";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: CandyColor | "white";
  padding?: "sm" | "md" | "lg";
  shadow?: "sm" | "md" | "lg";
  as?: "div" | "section" | "article" | "aside" | "header";
}

export function Card({
  color = "white",
  padding = "md",
  shadow = "md",
  as: Tag = "div",
  className = "",
  children,
  ...rest
}: CardProps) {
  const bgClass =
    color === "white"
      ? "bg-white text-[#1B1B1F]"
      : CANDY_SURFACE_CLASSES[color];

  const padClass =
    padding === "sm"
      ? "p-4 sm:p-5"
      : padding === "lg"
      ? "p-6 sm:p-8"
      : "p-5 sm:p-6";

  const shadowClass =
    shadow === "sm"
      ? "shadow-[4px_4px_0_#1B1B1F]"
      : shadow === "lg"
      ? "shadow-[8px_8px_0_#1B1B1F]"
      : "shadow-[6px_6px_0_#1B1B1F]";

  return (
    <Tag
      className={`rounded-[24px] border-[3px] border-[#1B1B1F] ${bgClass} ${padClass} ${shadowClass} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
