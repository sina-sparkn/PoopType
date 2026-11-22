"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGroup, motion } from "framer-motion";
import { CANDY_SURFACE_CLASSES, CandyColor } from "@/lib/theme";
import {
  smoothScrollToElement,
  smoothScrollToTop,
} from "@/lib/smooth-scroll";
import { SPRING_SNAPPY } from "@/components/motion/MotionPrimitives";
import { useLanguage } from "@/components/LanguageProvider";
import { playKawaiiSfx } from "@/lib/kawaii-sfx";

export const OPEN_UPLOAD_EVENT = "pooptype:open-upload";
export const FOCUS_ANALYZER_EVENT = "pooptype:focus-analyzer";

export interface BottomTabItem {
  id: string;
  href: string;
  label: string;
  icon: string;
  activeColor: CandyColor;
  matchPrefix?: boolean;
  badge?: string;
}

export const DEFAULT_BOTTOM_TABS: BottomTabItem[] = [
  {
    id: "analyze",
    href: "/",
    label: "Play",
    icon: "🔬",
    activeColor: "sunshine",
    matchPrefix: false,
  },
  {
    id: "types",
    href: "/types",
    label: "Types",
    icon: "💩",
    activeColor: "mint",
    matchPrefix: true,
  },
  {
    id: "science",
    href: "/science",
    label: "Real Facts",
    icon: "🧻",
    activeColor: "sky",
    matchPrefix: true,
  },
];

export interface BottomTabBarProps {
  tabs?: BottomTabItem[];
  onCameraClick?: () => void;
  onTabSelect?: (tab: BottomTabItem) => void;
  className?: string;
}

/**
 * Responsive mobile bottom tab bar engineered with CSS safe-area-insets
 * (`env(safe-area-inset-bottom/left/right)`) so interactive tabs remain
 * accessible above iOS/Android home indicators and clear of side notches.
 * Hidden at `md:` (768px+) where desktop header navigation takes over.
 */
export function BottomTabBar({
  tabs,
  onCameraClick,
  onTabSelect,
  className = "",
}: BottomTabBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();

  const resolvedTabs: BottomTabItem[] = tabs ?? [
    {
      id: "analyze",
      href: "/",
      label: t.nav.analyze,
      icon: "🔬",
      activeColor: "sunshine",
      matchPrefix: false,
    },
    {
      id: "types",
      href: "/types",
      label: t.nav.typesShort,
      icon: "💩",
      activeColor: "mint",
      matchPrefix: true,
    },
    {
      id: "science",
      href: "/science",
      label: t.nav.science,
      icon: "🧻",
      activeColor: "sky",
      matchPrefix: true,
    },
  ];

  const isOnHome = pathname === "/";

  const handleCameraTap = () => {
    playKawaiiSfx("pop");
    if (onCameraClick) {
      onCameraClick();
      return;
    }
    if (isOnHome) {
      smoothScrollToElement("analyzer", 84);
      window.dispatchEvent(new CustomEvent(OPEN_UPLOAD_EVENT));
    } else {
      router.push("/?upload=1#analyzer");
    }
  };

  const isTabActive = (tab: BottomTabItem) => {
    if (tab.matchPrefix) {
      return pathname.startsWith(tab.href);
    }
    return (
      pathname === tab.href ||
      (tab.href === "/" && pathname.startsWith("/result"))
    );
  };

  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tab: BottomTabItem
  ) => {
    playKawaiiSfx("pop");
    onTabSelect?.(tab);
    // Re-tapping the already-active exact route smoothly scrolls back to top
    if (pathname === tab.href) {
      e.preventDefault();
      smoothScrollToTop();
    }
  };

  const leadingTabs = resolvedTabs.slice(0, 1);
  const trailingTabs = resolvedTabs.slice(1);

  return (
    <nav
      aria-label={t.nav.mobileNavAria}
      data-testid="bottom-tab-bar"
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-[#1B1B1F] bg-[#FFF6E5]/95 backdrop-blur-sm shadow-[0_-4px_0_rgba(27,27,31,0.08)] safe-area-bottom-bar ${className}`}
    >
      <LayoutGroup id="mobile-tabs">
        <div
          data-testid="bottom-tab-bar-row"
          className="mx-auto grid max-w-md grid-cols-4 items-center gap-1.5 py-1.5"
        >
          {leadingTabs.map((tab) => (
            <TabLink
              key={tab.id}
              tab={tab}
              isActive={isTabActive(tab)}
              pathname={pathname}
              onClick={(e) => handleTabClick(e, tab)}
            />
          ))}

          {/* Raised center camera / upload quick-action button */}
          <div className="flex items-center justify-center -mt-6 px-1">
            <motion.button
              type="button"
              onClick={handleCameraTap}
              whileTap={{ scale: 0.92 }}
              transition={SPRING_SNAPPY}
              aria-label={t.nav.openCameraAria}
              data-testid="bottom-tab-camera"
              className="flex h-16 w-16 min-h-[64px] min-w-[64px] flex-col items-center justify-center rounded-full border-[3px] border-[#1B1B1F] bg-[#FF7AC6] text-[#1B1B1F] shadow-[4px_4px_0_#1B1B1F] sticker-press cursor-pointer touch-manipulation select-none"
            >
              <CameraGlyph />
            </motion.button>
          </div>

          {trailingTabs.map((tab) => (
            <TabLink
              key={tab.id}
              tab={tab}
              isActive={isTabActive(tab)}
              pathname={pathname}
              onClick={(e) => handleTabClick(e, tab)}
            />
          ))}
        </div>
      </LayoutGroup>
    </nav>
  );
}

function CameraGlyph() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1B1B1F"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="pointer-events-none"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function TabLink({
  tab,
  isActive,
  pathname,
  onClick,
}: {
  tab: BottomTabItem;
  isActive: boolean;
  pathname: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href={tab.href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      data-testid={`bottom-tab-${tab.id}`}
      className="relative flex min-h-[54px] min-w-[54px] w-full flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-2 text-xs font-extrabold text-[#1B1B1F] hover:bg-[#1B1B1F]/5 active:bg-[#1B1B1F]/10 transition-colors touch-manipulation select-none"
    >
      {isActive && (
        <motion.span
          layoutId="mobile-tab-pill"
          layout="position"
          layoutDependency={pathname}
          transition={SPRING_SNAPPY}
          aria-hidden="true"
          className={`absolute inset-0 rounded-2xl border-2 border-[#1B1B1F] shadow-[2px_2px_0_#1B1B1F] ${CANDY_SURFACE_CLASSES[tab.activeColor]}`}
        />
      )}
      <span
        className="relative z-10 text-lg leading-none pointer-events-none"
        aria-hidden="true"
      >
        {tab.icon}
      </span>
      <span className="relative z-10 leading-tight tracking-wide pointer-events-none">
        {tab.label}
      </span>
      {tab.badge && (
        <span className="absolute -top-1 -right-1 z-20 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[#1B1B1F] bg-[#FF7AC6] px-1 text-[10px] font-black text-[#1B1B1F]">
          {tab.badge}
        </span>
      )}
    </Link>
  );
}
