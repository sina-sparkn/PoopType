import type { Metadata } from "next";
import { ScienceView } from "@/components/ScienceView";

export const metadata: Metadata = {
  title: "The Real Facts | PoopType",
  description:
    "Simple, real doctor facts about poop color, shape, and tummy health — plus why a photo can never guess your personality!",
};

export default function SciencePage() {
  return <ScienceView />;
}
