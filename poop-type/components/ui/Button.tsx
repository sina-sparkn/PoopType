"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CANDY_SURFACE_CLASSES, CandyColor } from "@/lib/theme";
import { FOCUS_ANALYZER_EVENT } from "@/components/layout/BottomTabBar";
import { smoothScrollToElement } from "@/lib/smooth-scroll";

type ButtonSize = "md" | "lg";

interface BaseProps {
  color?: CandyColor;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  "data-testid"?: string;
  children: React.ReactNode;
}

interface ActionButtonProps
  extends BaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color" | "children"> {
  href?: undefined;
}

interface LinkButtonProps extends BaseProps {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  "aria-label"?: string;
}

export type ButtonProps = ActionButtonProps | LinkButtonProps;

export function Button(props: ButtonProps) {
  const pathname = usePathname();
  const {
    color = "sunshine",
    size = "md",
    fullWidth = false,
    className = "",
    children,
  } = props;

  const sizeClass =
    size === "lg"
      ? "min-h-[54px] px-7 py-3 text-lg sm:text-xl"
      : "min-h-[48px] px-5 py-2.5 text-base";

  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-full border-[3px] border-[#1B1B1F]",
    "font-display tracking-wide shadow-[4px_4px_0_#1B1B1F] sticker-press",
    "cursor-pointer select-none whitespace-nowrap shrink-0 touch-manipulation",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-[2px_2px_0_#1B1B1F]",
    CANDY_SURFACE_CLASSES[color],
    sizeClass,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && typeof props.href === "string") {
    const { href, onClick } = props;

    const handleLinkClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
      onClick?.(e);
      if (e.defaultPrevented) return;

      // Ensure same-page hash links (like #analyzer or /#analyzer while on /)
      // ALWAYS glide smoothly with Framer Motion easing even on repeated clicks.
      let hashId: string | null = null;
      if (href.startsWith("#")) {
        hashId = href.slice(1);
      } else if (href.startsWith("/#") && pathname === "/") {
        hashId = href.slice(2);
      }

      if (hashId && smoothScrollToElement(hashId, 88)) {
        e.preventDefault();
        if (window.location.hash !== `#${hashId}`) {
          window.history.replaceState(null, "", `#${hashId}`);
        }
        if (hashId === "analyzer") {
          window.dispatchEvent(new CustomEvent(FOCUS_ANALYZER_EVENT));
        }
      }
    };

    return (
      <Link
        href={href}
        onClick={handleLinkClick}
        aria-label={props["aria-label"]}
        data-testid={props["data-testid"]}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  const {
    color: _c,
    size: _s,
    fullWidth: _fw,
    className: _cn,
    children: _ch,
    type = "button",
    ...rest
  } = props as ActionButtonProps;
  void _c;
  void _s;
  void _fw;
  void _cn;
  void _ch;

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
