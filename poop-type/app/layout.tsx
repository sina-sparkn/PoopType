import type { Metadata, Viewport } from "next";
import { Lilita_One, Nunito, Vazirmatn } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
import { BackgroundMusicPlayer } from "@/components/layout/BackgroundMusicPlayer";
import { FloatingDoodles } from "@/components/ui/FloatingDoodles";
import { PageTransition } from "@/components/motion/MotionPrimitives";

const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-lilita",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PoopType — Silly Poop Personality Game!",
  description:
    "Pick a photo on your phone to get a funny 4-letter poop personality card! 100% private — your photo never leaves your device.",
  manifest: "/assets/aistudio/site_7a9e07ce.webmanifest",
  icons: {
    icon: [
      {
        url: "/assets/aistudio/favicon-32x32_33e2b3a7.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/assets/aistudio/favicon-16x16_586e57aa.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/assets/aistudio/android-chrome-192x192_ff99273f.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/assets/aistudio/android-chrome-512x512_5967c095.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: "/assets/aistudio/favicon-32x32_33e2b3a7.png",
    apple: [
      {
        url: "/assets/aistudio/apple-touch-icon_11e8908d.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "PoopType — Silly Poop Personality Game!",
    description:
      "Pick a photo on your phone to get a funny 4-letter poop personality card! 100% private — nothing is uploaded.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PoopType — Silly Poop Personality Game!",
    description:
      "A silly bathroom personality game. Your photo never leaves your phone!",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFF6E5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      className={`${lilitaOne.variable} ${nunito.variable} ${vazirmatn.variable}`}
    >
      <body className="relative min-h-[100dvh] flex flex-col bg-sticker-canvas text-[#1B1B1F] antialiased">
        <LanguageProvider>
          <MotionProvider>
            <FloatingDoodles />
            <SiteHeader />
            <main className="relative z-10 flex-1 w-full">
              <PageTransition>{children}</PageTransition>
            </main>
            <SiteFooter />
            <BackgroundMusicPlayer />
            <BackToTopButton />
            <BottomTabBar />
          </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
