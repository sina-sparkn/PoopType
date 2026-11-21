import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { decodeResultParams } from "@/lib/analyze";
import { ResultView } from "@/components/ResultView";
import { EN_DICT } from "@/lib/i18n/en";

interface ResultPageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
  searchParams,
}: ResultPageProps): Promise<Metadata> {
  const { code } = await params;
  const resolvedSearchParams = await searchParams;
  const reconstructed = decodeResultParams(code, resolvedSearchParams);

  if (!reconstructed) {
    return {
      title: "Unknown Card | PoopType",
    };
  }

  const friendly = EN_DICT.types[reconstructed.code];
  const title = `${reconstructed.code} — ${friendly.nickname} | PoopType`;
  const description = `${friendly.blurb} Shape ${reconstructed.bristolType} · ${reconstructed.confidence.toFixed(1)}% silly guess.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function ResultPage({
  params,
  searchParams,
}: ResultPageProps) {
  const { code } = await params;
  const resolvedSearchParams = await searchParams;
  const reconstructed = decodeResultParams(code, resolvedSearchParams);

  if (!reconstructed) {
    notFound();
  }

  return <ResultView result={reconstructed} />;
}
