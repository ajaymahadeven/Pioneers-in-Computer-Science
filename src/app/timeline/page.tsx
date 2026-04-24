import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/server/db";
import { blobToProxyUrl, ERA_COLORS, ERA_LABELS } from "@/lib/utils";
import { PioneerImage } from "@/components/avatar-placeholder/PioneerImage";
import { AvatarPlaceholder } from "@/components/avatar-placeholder/AvatarPlaceholder";
import { SiteFooter } from "@/components/site-footer/SiteFooter";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "A chronological journey through computer science history — from 9th-century Baghdad to the AI era.",
};

function groupLabel(year: number): string {
  if (year < 1900) {
    const century = Math.floor(year / 100) + 1;
    const suffix =
      century === 11
        ? "11th"
        : century === 12
          ? "12th"
          : century === 13
            ? "13th"
            : `${century}th`;
    return `${suffix} Century`;
  }
  const decade = Math.floor(year / 10) * 10;
  return `${decade}s`;
}

function groupKey(year: number): number {
  if (year < 1900) return Math.floor(year / 100) * 100;
  return Math.floor(year / 10) * 10;
}

async function getPioneers() {
  return db.pioneer.findMany({
    orderBy: { contributionYear: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      knownFor: true,
      imageLocal: true,
      era: true,
      birthCountry: true,
      contributionYear: true,
      classifications: {
        take: 1,
        select: { classification: { select: { name: true } } },
      },
    },
  });
}

export default async function TimelinePage() {
  const pioneers = await getPioneers();

  // Group into ordered buckets
  const buckets = new Map<number, typeof pioneers>();
  for (const p of pioneers) {
    const key = groupKey(p.contributionYear);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(p);
  }
  const groups = Array.from(buckets.entries()).sort(([a], [b]) => a - b);

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="border-border border-b">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
          <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-widest uppercase">
            History
          </p>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Timeline
          </h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">
            {pioneers.length} pioneers · 830 AD → 2019
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        {groups.map(([key, group]) => (
          <div key={key} className="mb-14">
            {/* Sticky decade/century header */}
            <div className="bg-background sticky top-14 z-10 -mx-4 mb-6 border-b border-dashed px-4 py-2 md:-mx-6 md:px-6">
              <h2 className="text-foreground font-mono text-sm font-semibold tracking-widest">
                {groupLabel(group[0]?.contributionYear ?? 0)}
                <span className="text-muted-foreground ml-3 font-normal">
                  {group.length} pioneer{group.length !== 1 ? "s" : ""}
                </span>
              </h2>
            </div>

            {/* Entries */}
            <div className="relative">
              {/* Vertical line */}
              <div className="bg-border absolute top-0 left-[19px] h-full w-px" />

              <div className="space-y-6">
                {group.map((p) => {
                  const imgSrc = blobToProxyUrl(p.imageLocal);
                  const eraColor = ERA_COLORS[p.era] ?? "#888888";
                  const eraLabel = ERA_LABELS[p.era] ?? p.era;
                  const field =
                    p.classifications[0]?.classification.name ?? null;

                  return (
                    <Link
                      key={p.id}
                      href={`/pioneer/${p.slug}`}
                      className="group relative flex items-start gap-5 pl-10"
                    >
                      {/* Era dot on the line */}
                      <span
                        className="border-background absolute top-4 left-[13px] h-3 w-3 flex-none rounded-full border-2 transition-transform group-hover:scale-125"
                        style={{ backgroundColor: eraColor }}
                      />

                      {/* Portrait */}
                      <div className="border-border bg-muted relative h-16 w-12 flex-none overflow-hidden rounded border">
                        {imgSrc ? (
                          <PioneerImage
                            src={imgSrc}
                            alt={p.name}
                            name={p.name}
                            sizes="48px"
                            className="object-cover object-top grayscale transition-all duration-300 group-hover:grayscale-0"
                          />
                        ) : (
                          <AvatarPlaceholder name={p.name} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex flex-1 flex-col gap-0.5 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-foreground text-sm font-semibold group-hover:underline">
                            {p.name}
                          </span>
                          <span className="text-muted-foreground font-mono text-xs">
                            {p.contributionYear}
                          </span>
                        </div>

                        {p.knownFor && (
                          <p className="text-muted-foreground line-clamp-1 text-sm">
                            {p.knownFor}
                          </p>
                        )}

                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <span
                            className="rounded px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-white uppercase"
                            style={{ backgroundColor: eraColor }}
                          >
                            {eraLabel}
                          </span>
                          {field && (
                            <span className="border-border bg-muted text-muted-foreground rounded border px-1.5 py-0.5 text-[9px] tracking-wide uppercase">
                              {field}
                            </span>
                          )}
                          {p.birthCountry && (
                            <span className="text-muted-foreground/60 font-mono text-[9px]">
                              {p.birthCountry}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SiteFooter />
    </div>
  );
}
