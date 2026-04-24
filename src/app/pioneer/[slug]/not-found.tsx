import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { db } from "@/server/db";
import { blobToProxyUrl, ERA_COLORS } from "@/lib/utils";
import { PioneerImage } from "@/components/avatar-placeholder/PioneerImage";
import { AvatarPlaceholder } from "@/components/avatar-placeholder/AvatarPlaceholder";

export default async function PioneerNotFound() {
  // Load all slugs + names to find closest matches
  const all = await db.pioneer.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      era: true,
      imageLocal: true,
      knownFor: true,
    },
  });

  // Pick 4 random suggestions weighted toward short slug distance
  // Since we don't have the attempted slug here, just surface 4 varied picks
  const shuffled = all
    .map((p) => ({ p, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, 4)
    .map(({ p }) => p);

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-24 text-center md:px-6">
        <p className="text-muted-foreground mb-4 font-mono text-[10px] font-medium tracking-widest uppercase">
          404
        </p>
        <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight">
          Pioneer not found
        </h1>
        <p className="text-muted-foreground mb-10 text-sm leading-relaxed">
          This page doesn&apos;t exist — the URL may be misspelled or the
          pioneer hasn&apos;t been added yet.
        </p>

        {shuffled.length > 0 && (
          <div className="mb-10 text-left">
            <p className="text-muted-foreground mb-4 text-[10px] font-medium tracking-widest uppercase">
              You might be looking for
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {shuffled.map((p) => {
                const imgSrc = blobToProxyUrl(p.imageLocal);
                const eraColor = ERA_COLORS[p.era] ?? "#888888";
                return (
                  <Link
                    key={p.id}
                    href={`/pioneer/${p.slug}`}
                    className="border-border bg-card hover:bg-accent group flex items-center gap-3 rounded-lg border p-3 transition-colors"
                  >
                    <div
                      className="relative h-12 w-9 flex-none overflow-hidden rounded"
                      style={{ backgroundColor: eraColor + "22" }}
                    >
                      {imgSrc ? (
                        <PioneerImage
                          src={imgSrc}
                          alt={p.name}
                          name={p.name}
                          sizes="36px"
                          className="object-cover object-top grayscale transition-all duration-300 group-hover:grayscale-0"
                        />
                      ) : (
                        <AvatarPlaceholder name={p.name} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-medium">
                        {p.name}
                      </p>
                      {p.knownFor && (
                        <p className="text-muted-foreground truncate text-[11px]">
                          {p.knownFor}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/explore"
            className="border-border bg-muted text-foreground hover:bg-accent inline-flex items-center gap-2 rounded border px-4 py-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Explore
          </Link>
          <Link
            href="/explore"
            className="border-border bg-foreground text-background inline-flex items-center gap-2 rounded border px-4 py-2 text-sm font-medium transition-colors hover:opacity-85"
          >
            <Search className="h-3.5 w-3.5" />
            Search all pioneers
          </Link>
        </div>
      </div>
    </div>
  );
}
