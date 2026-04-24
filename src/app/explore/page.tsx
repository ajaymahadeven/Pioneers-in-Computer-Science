import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/server/db";
import { slugify, blobToProxyUrl, ERA_LABELS, ERA_COLORS } from "@/lib/utils";
import { PioneerImage } from "@/components/avatar-placeholder/PioneerImage";
import { AvatarPlaceholder } from "@/components/avatar-placeholder/AvatarPlaceholder";
import { SiteFooter } from "@/components/site-footer/SiteFooter";
import { ExploreFilters } from "@/app/explore/_components/ExploreFilters";
import type { Metadata } from "next";

const PER_PAGE = 24;

export const metadata: Metadata = {
  title: "Explore Pioneers",
  description:
    "Browse all 184 pioneers in computer science. Filter by era, field, or country.",
};

interface SearchParams {
  q?: string;
  era?: string;
  field?: string;
  country?: string;
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

async function getPioneers(sp: SearchParams) {
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const skip = (page - 1) * PER_PAGE;

  const where = {
    ...(sp.era ? { era: sp.era as never } : {}),
    ...(sp.country ? { birthCountry: sp.country } : {}),
    ...(sp.field
      ? {
          classifications: {
            some: { classification: { name: { equals: sp.field, mode: "insensitive" as const } } },
          },
        }
      : {}),
    ...(sp.q
      ? {
          OR: [
            { name: { contains: sp.q, mode: "insensitive" as const } },
            { knownFor: { contains: sp.q, mode: "insensitive" as const } },
            { birthCountry: { contains: sp.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [pioneers, total] = await Promise.all([
    db.pioneer.findMany({
      where,
      orderBy: { contributionYear: "asc" },
      skip,
      take: PER_PAGE,
      select: {
        id: true,
        name: true,
        knownFor: true,
        imageLocal: true,
        era: true,
        birthCountry: true,
        contributionYear: true,
        classifications: {
          take: 2,
          select: { classification: { select: { name: true } } },
        },
      },
    }),
    db.pioneer.count({ where }),
  ]);

  return { pioneers, total, page, totalPages: Math.ceil(total / PER_PAGE) };
}

async function getFilterOptions() {
  const [countries, fields] = await Promise.all([
    db.pioneer.findMany({
      select: { birthCountry: true },
      distinct: ["birthCountry"],
      orderBy: { birthCountry: "asc" },
    }),
    db.classification.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    }),
  ]);
  return {
    countries: countries.map((c) => c.birthCountry),
    fields: fields.map((f) => f.name),
  };
}

export default async function ExplorePage({ searchParams }: Props) {
  const sp = await searchParams;
  const [{ pioneers, total, page, totalPages }, filterOptions] =
    await Promise.all([getPioneers(sp), getFilterOptions()]);

  const hasFilters = !!(sp.q ?? sp.era ?? sp.field ?? sp.country);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Encyclopedia
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Explore Pioneers
          </h1>
          <p className="mt-1 font-mono text-sm text-muted-foreground">
            {total} result{total !== 1 ? "s" : ""}
            {hasFilters ? " matching filters" : " in total"}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {/* Filters */}
        <Suspense>
          <ExploreFilters
            currentQ={sp.q ?? ""}
            currentEra={sp.era ?? ""}
            currentField={sp.field ?? ""}
            currentCountry={sp.country ?? ""}
            countries={filterOptions.countries}
            fields={filterOptions.fields}
          />
        </Suspense>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {sp.q && <FilterChip label={`"${sp.q}"`} param="q" sp={sp} />}
            {sp.era && (
              <FilterChip
                label={ERA_LABELS[sp.era] ?? sp.era}
                param="era"
                sp={sp}
              />
            )}
            {sp.field && <FilterChip label={sp.field} param="field" sp={sp} />}
            {sp.country && (
              <FilterChip label={sp.country} param="country" sp={sp} />
            )}
            <Link
              href="/explore"
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear all
            </Link>
          </div>
        )}

        {/* Grid */}
        {pioneers.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
            <p className="text-sm text-muted-foreground">
              No pioneers found for these filters.
            </p>
            <Link
              href="/explore"
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {pioneers.map((p) => {
              const imgSrc = blobToProxyUrl(p.imageLocal);
              const eraColor = ERA_COLORS[p.era] ?? "#888888";
              const eraLabel = ERA_LABELS[p.era] ?? p.era;
              return (
                <Link
                  key={p.id}
                  href={`/pioneer/${slugify(p.name)}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-accent"
                >
                  {/* Portrait */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                    {imgSrc ? (
                      <PioneerImage
                        src={imgSrc}
                        alt={p.name}
                        name={p.name}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                        className="object-cover object-top grayscale transition-all duration-300 group-hover:grayscale-0"
                      />
                    ) : (
                      <AvatarPlaceholder name={p.name} />
                    )}
                    <span
                      className="absolute bottom-1.5 left-1.5 rounded px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white"
                      style={{ backgroundColor: eraColor }}
                    >
                      {eraLabel}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1 p-2.5">
                    <p className="line-clamp-1 text-[11px] font-semibold text-foreground">
                      {p.name}
                    </p>
                    <p className="line-clamp-1 text-[10px] text-muted-foreground">
                      {p.birthCountry}
                    </p>
                    {p.classifications.length > 0 && (
                      <p className="mt-auto line-clamp-1 text-[9px] uppercase tracking-wide text-muted-foreground/70">
                        {p.classifications[0]?.classification.name}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {page > 1 && (
              <PaginationLink
                sp={sp}
                page={page - 1}
                label="← Prev"
              />
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - page) <= 2,
                )
                .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                    acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-1 text-xs text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <PaginationLink
                      key={p}
                      sp={sp}
                      page={p}
                      label={String(p)}
                      active={p === page}
                    />
                  ),
                )}
            </div>

            {page < totalPages && (
              <PaginationLink
                sp={sp}
                page={page + 1}
                label="Next →"
              />
            )}
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}

function buildHref(sp: SearchParams, overrides: Partial<SearchParams>) {
  const merged = { ...sp, ...overrides };
  const params = new URLSearchParams();
  if (merged.q) params.set("q", merged.q);
  if (merged.era) params.set("era", merged.era);
  if (merged.field) params.set("field", merged.field);
  if (merged.country) params.set("country", merged.country);
  if (merged.page && merged.page !== "1") params.set("page", merged.page);
  const qs = params.toString();
  return `/explore${qs ? `?${qs}` : ""}`;
}

function FilterChip({
  label,
  param,
  sp,
}: {
  label: string;
  param: keyof SearchParams;
  sp: SearchParams;
}) {
  const href = buildHref(sp, { [param]: undefined, page: "1" });
  return (
    <Link
      href={href}
      className="flex items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 text-[11px] text-foreground transition-colors hover:bg-accent"
    >
      {label}
      <span className="text-muted-foreground">✕</span>
    </Link>
  );
}

function PaginationLink({
  sp,
  page,
  label,
  active,
}: {
  sp: SearchParams;
  page: number;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={buildHref(sp, { page: String(page) })}
      className={`rounded border px-3 py-1.5 font-mono text-xs transition-colors ${
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}
