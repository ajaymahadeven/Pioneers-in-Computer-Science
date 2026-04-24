import Link from "next/link";
import { Calendar } from "lucide-react";
import { db } from "@/server/db";
import { blobToProxyUrl, ERA_COLORS, ERA_LABELS } from "@/lib/utils";
import { PioneerImage } from "@/components/avatar-placeholder/PioneerImage";
import { AvatarPlaceholder } from "@/components/avatar-placeholder/AvatarPlaceholder";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function OnThisDay() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // Compute a stable day-of-year index (1–365) to rotate the spotlight daily
  const start = new Date(today.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (today.getTime() - start.getTime()) / 86_400_000,
  );

  const total = await db.pioneer.count();
  if (total === 0) return null;

  // Pick 3 pioneers starting at a daily-rotating offset
  const offset = dayOfYear % total;
  const [a, b, c] = await Promise.all([
    db.pioneer.findFirst({ skip: offset % total, select: pioneerSelect }),
    db.pioneer.findFirst({
      skip: (offset + Math.floor(total / 3)) % total,
      select: pioneerSelect,
    }),
    db.pioneer.findFirst({
      skip: (offset + Math.floor((total * 2) / 3)) % total,
      select: pioneerSelect,
    }),
  ]);

  const picks = [a, b, c].filter(Boolean);
  if (picks.length === 0) return null;

  const monthName = MONTH_NAMES[month - 1] ?? "January";

  return (
    <section className="border-border border-t py-14">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="border-border bg-muted flex h-8 w-8 items-center justify-center rounded border">
            <Calendar className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
              On This Day
            </p>
            <h2 className="text-foreground text-sm font-semibold">
              {monthName} {day} — Today&apos;s Pioneers
            </h2>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((p) => {
            if (!p) return null;
            const imgSrc = blobToProxyUrl(p.imageLocal);
            const eraColor = ERA_COLORS[p.era] ?? "#888888";
            const eraLabel = ERA_LABELS[p.era] ?? p.era;

            return (
              <Link
                key={p.id}
                href={`/pioneer/${p.slug}`}
                className="border-border bg-card hover:bg-accent group flex items-center gap-4 rounded-lg border p-4 transition-colors"
              >
                <div
                  className="relative h-16 w-12 flex-none overflow-hidden rounded"
                  style={{ backgroundColor: eraColor + "22" }}
                >
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

                <div className="min-w-0 flex-1">
                  <div className="mb-1">
                    <span
                      className="rounded px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-white uppercase"
                      style={{ backgroundColor: eraColor }}
                    >
                      {eraLabel}
                    </span>
                  </div>
                  <p className="text-foreground truncate text-sm font-semibold">
                    {p.name}
                  </p>
                  {p.knownFor && (
                    <p className="text-muted-foreground truncate text-[11px]">
                      {p.knownFor}
                    </p>
                  )}
                  {(p.birthYear ?? p.deathYear) && (
                    <p className="text-muted-foreground mt-1 font-mono text-[10px]">
                      {p.birthYear ?? "?"}
                      {p.deathYear ? ` – ${p.deathYear}` : ""}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const pioneerSelect = {
  id: true,
  name: true,
  slug: true,
  birthYear: true,
  deathYear: true,
  era: true,
  imageLocal: true,
  knownFor: true,
} as const;
