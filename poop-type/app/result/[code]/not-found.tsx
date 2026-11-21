import { Card } from "@/components/ui/Card";
import { Sticker } from "@/components/ui/Sticker";
import { Button } from "@/components/ui/Button";
import { PoopMascot } from "@/components/mascot/PoopMascot";

export default function ResultNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <Card color="sunshine" padding="lg" shadow="lg" className="text-center">
        <div className="flex justify-center">
          <Sticker color="bubblegum" tilt="left" size="sm">
            🧻 Classification Error · 404
          </Sticker>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="rounded-[24px] border-[3px] border-[#1B1B1F] bg-[#FFF6E5] p-4 shadow-[4px_4px_0_#1B1B1F]">
            <PoopMascot
              mood="shy"
              size={128}
              label="Shy mascot apologizing for unknown PoopType code"
            />
          </div>
        </div>

        <h1 className="mt-6 font-display text-[clamp(2rem,6vw,3rem)] leading-tight text-[#1B1B1F]">
          No such PoopType exists!
        </h1>

        <p className="mt-3 text-base sm:text-lg font-bold leading-relaxed text-[#1B1B1F]">
          Valid codes consist of four letters drawn from Form (P/F), Outline
          (P/R), Tone (T/L), and Sheen (O/D)—such as{" "}
          <span className="inline-block rounded-lg border-2 border-[#1B1B1F] bg-white px-2 py-0.5 font-display">
            PPTO
          </span>{" "}
          or{" "}
          <span className="inline-block rounded-lg border-2 border-[#1B1B1F] bg-white px-2 py-0.5 font-display">
            PPLO
          </span>
          .
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" color="mint" size="lg">
            💩 Analyze a Photo
          </Button>
          <Button href="/types" color="sky" size="lg">
            🃏 View All 16 Types
          </Button>
        </div>
      </Card>
    </div>
  );
}
