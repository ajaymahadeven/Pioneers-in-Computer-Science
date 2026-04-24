import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { slugify, blobToProxyUrl } from "@/lib/utils";
import { PioneerImage } from "@/components/avatar-placeholder/PioneerImage";
import { AvatarPlaceholder } from "@/components/avatar-placeholder/AvatarPlaceholder";
import type { HeroPioneer } from "@/types/pioneer";

export function HeroSection({
  mosaicPioneers,
}: {
  mosaicPioneers: HeroPioneer[];
}) {
  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-white dark:bg-black">
      {/* Dot grid — light mode uses dark dots, dark mode uses white dots */}
      <div className="dot-grid-light dark:dot-grid absolute inset-0" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl items-center px-4 py-20 md:px-6">
        {/* Left — text */}
        <div className="flex flex-1 flex-col gap-6 lg:max-w-[52%]">
          <span className="w-fit rounded border border-black/15 bg-black/5 px-2.5 py-1 text-xs font-medium tracking-widest text-black/50 uppercase dark:border-white/15 dark:bg-white/8 dark:text-white/50">
            184 Pioneers · 12 Centuries · 52 Fields
          </span>

          <h1 className="text-5xl leading-[1.08] font-bold tracking-tight text-black sm:text-6xl lg:text-7xl dark:text-white">
            The minds that built{" "}
            <span className="text-black/35 dark:text-white/40">
              the digital world
            </span>
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-black/50 dark:text-white/45">
            An interactive encyclopedia of computer science&apos;s greatest
            pioneers — from 9th-century Baghdad to Silicon Valley.
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              asChild
              size="lg"
              className="rounded-md bg-black px-6 text-sm font-medium text-white hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <Link href="/explore">Explore All Pioneers</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-md border-black/20 bg-transparent px-6 text-sm font-medium text-black/70 hover:border-black/40 hover:bg-black/5 hover:text-black dark:border-white/20 dark:text-white/70 dark:hover:border-white/40 dark:hover:bg-white/8 dark:hover:text-white"
            >
              <Link href="/random">
                <Shuffle className="mr-2 h-3.5 w-3.5" />
                Random Pioneer
              </Link>
            </Button>
          </div>
        </div>

        {/* Right — mosaic */}
        <div className="absolute top-0 right-0 hidden h-full w-[46%] lg:block">
          <div className="relative h-full">
            <div className="absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent dark:from-black" />
            <div className="absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-white to-transparent dark:from-black" />
            <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-white to-transparent dark:from-black" />
            <MosaicGrid pioneers={mosaicPioneers} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MosaicGrid({ pioneers }: { pioneers: HeroPioneer[] }) {
  const cols = [
    pioneers.slice(0, 2),
    pioneers.slice(2, 5),
    pioneers.slice(5, 7),
  ];
  const offsets = ["mt-16", "mt-0", "mt-24"];

  return (
    <div className="flex h-full gap-2.5 px-4 py-8">
      {cols.map((col, ci) => (
        <div
          key={ci}
          className={`flex flex-1 flex-col gap-2.5 ${offsets[ci] ?? ""}`}
        >
          {col.map((pioneer) => (
            <Link
              key={pioneer.id}
              href={`/pioneer/${slugify(pioneer.name)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-black/8 transition-colors hover:border-black/20 dark:border-white/8 dark:hover:border-white/20"
            >
              {blobToProxyUrl(pioneer.imageLocal) ? (
                <PioneerImage
                  src={blobToProxyUrl(pioneer.imageLocal)!}
                  alt={pioneer.name}
                  name={pioneer.name}
                  sizes="15vw"
                  className="object-cover object-top brightness-60 grayscale transition-all duration-500 group-hover:brightness-75"
                />
              ) : (
                <AvatarPlaceholder name={pioneer.name} />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 dark:from-black/90">
                <p className="line-clamp-1 text-[10px] font-medium tracking-wide text-white/80 uppercase">
                  {pioneer.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
