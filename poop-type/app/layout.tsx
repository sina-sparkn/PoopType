import type { Metadata, Viewport } from "next";
import { Lilita_One, Nunito, Vazirmatn } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { MotionProvider } from "@/components/MotionProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { BackToTopButton } from "@/components/layout/BackToTopButton";
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
  icons: {
    icon: [
      {
        url: "/assets/aistudio/Cute_Winking_Poop_App_Icon_e89880a1.png",
        type: "image/png",
      },
    ],
    shortcut: "/assets/aistudio/Cute_Winking_Poop_App_Icon_e89880a1.png",
    apple: "/assets/aistudio/Cute_Winking_Poop_App_Icon_e89880a1.png",
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
            <BackToTopButton />
            <BottomTabBar />
          </MotionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
