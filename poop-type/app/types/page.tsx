import type { Metadata } from "next";
import { TypesPageView } from "@/components/TypesPageView";

export const metadata: Metadata = {
  title: "All 16 Types | PoopType",
  description:
    "Meet all 16 funny PoopType cartoon characters and tap any card to flip it open!",
};

export default function TypesPage() {
  return <TypesPageView />;
}
