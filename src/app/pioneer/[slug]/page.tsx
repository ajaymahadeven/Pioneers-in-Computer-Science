import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { db } from "@/server/db";
import { slugify, blobToProxyUrl, ERA_LABELS, ERA_COLORS } from "@/lib/utils";
import { AvatarPlaceholder } from "@/components/avatar-placeholder/AvatarPlaceholder";
import { PioneerImage } from "@/components/avatar-placeholder/PioneerImage";
import { ShareButton } from "./_components/ShareButton";

interface Props {
  params: Promise<{ slug: string }>;
}

async function recordView(pioneerId: number) {
  try {
    const hdrs = await headers();
    const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    let ipHash: string | null = null;
    if (ip) {
      const buf = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(ip),
      );
      ipHash = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    await db.pioneerView.create({ data: { pioneerId, ipHash } });
  } catch {
    // Non-fatal — don't break the page if tracking fails
  }
}

export async function generateStaticParams() {
  const pioneers = await db.pioneer.findMany({ select: { slug: true } });
  return pioneers.map((p) => ({ slug: p.slug }));
}

export default async function PioneerPage({ params }: Props) {
  const { slug } = await params;

  const pioneer = await db.pioneer.findUnique({
    where: { slug },
    include: {
      classifications: {
        select: { classificationId: true, classification: true },
      },
      education: { orderBy: { year: "asc" } },
      awards: { orderBy: { year: "asc" } },
      institutions: true,
      notableWorks: { orderBy: { year: "asc" } },
      funFacts: { orderBy: { order: "asc" } },
      influences: true,
    },
  });

  if (!pioneer) notFound();

  // Record the view (fire-and-forget, non-blocking)
  void recordView(pioneer.id);

  const classificationIds = pioneer.classifications.map(
    (c) => c.classificationId,
  );

  const related = await db.pioneer.findMany({
    where: {
      id: { not: pioneer.id },
      OR: [
        { era: pioneer.era },
        ...(classificationIds.length > 0
          ? [
              {
                classifications: {
                  some: { classificationId: { in: classificationIds } },
                },
              },
            ]
          : []),
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      knownFor: true,
      era: true,
      imageLocal: true,
    },
    take: 4,
    orderBy: { contributionYear: "asc" },
  });

  const imageSrc = blobToProxyUrl(pioneer.imageLocal);
  const eraLabel = ERA_LABELS[pioneer.era] ?? pioneer.era;
  const eraColor = ERA_COLORS[pioneer.era] ?? "#888888";

  const influencedBy = pioneer.influences.filter(
    (i) => i.direction === "influencedBy",
  );
  const influenced = pioneer.influences.filter(
    (i) => i.direction === "influenced",
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Breadcrumb nav */}
      <div className="border-border bg-background/80 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 font-mono text-xs">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="text-muted-foreground/50 h-3 w-3" />
            <Link
              href="/explore"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Explore
            </Link>
            <ChevronRight className="text-muted-foreground/50 h-3 w-3" />
            <span className="text-foreground max-w-[200px] truncate">
              {pioneer.name}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <ShareButton />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-start">
          {/* Portrait */}
          <div className="border-border bg-muted relative h-48 w-40 flex-none overflow-hidden rounded-lg border">
            {imageSrc ? (
              <PioneerImage
                src={imageSrc}
                alt={pioneer.name}
                name={pioneer.name}
                sizes="160px"
                className="object-cover object-top"
              />
            ) : (
              <AvatarPlaceholder name={pioneer.name} />
            )}
          </div>

          {/* Bio header */}
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded px-2 py-0.5 text-[10px] font-medium tracking-widest text-white uppercase"
                style={{ backgroundColor: eraColor }}
              >
                {eraLabel}
              </span>
              {pioneer.classifications.slice(0, 3).map(({ classification }) => (
                <span
                  key={classification.name}
                  className="border-border bg-muted text-muted-foreground rounded border px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase"
                >
                  {classification.name}
                </span>
              ))}
            </div>

            <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              {pioneer.name}
            </h1>

            {pioneer.knownFor && (
              <p className="text-muted-foreground text-base">
                {pioneer.knownFor}
              </p>
            )}

            {/* Meta row */}
            <div className="text-muted-foreground flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs">
              {pioneer.birthYear && (
                <span>
                  {pioneer.birthYear}
                  {pioneer.deathYear ? ` – ${pioneer.deathYear}` : " – present"}
                </span>
              )}
              {pioneer.birthCountry && <span>{pioneer.birthCountry}</span>}
              {pioneer.contributionYear && (
                <span>Contribution: {pioneer.contributionYear}</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Intro */}
            <Section title="Introduction">
              <p className="text-foreground text-sm leading-relaxed">
                {pioneer.intro}
              </p>
            </Section>

            {/* Achievement */}
            <Section title="Key Achievement">
              <p className="text-foreground text-sm leading-relaxed">
                {pioneer.achievement}
              </p>
            </Section>

            {/* Long bio */}
            {pioneer.longBio && (
              <Section title="Biography">
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-line">
                  {pioneer.longBio}
                </p>
              </Section>
            )}

            {/* Notable works */}
            {pioneer.notableWorks.length > 0 && (
              <Section title="Notable Works">
                <div className="divide-border divide-y">
                  {pioneer.notableWorks.map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between py-2.5"
                    >
                      <div>
                        <p className="text-foreground text-sm font-medium">
                          {w.title}
                        </p>
                        <p className="text-muted-foreground text-[11px] tracking-widest uppercase">
                          {w.type}
                        </p>
                      </div>
                      {w.year && (
                        <span className="text-muted-foreground font-mono text-xs">
                          {w.year}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Fun facts */}
            {pioneer.funFacts.length > 0 && (
              <Section title="Did You Know?">
                <ul className="space-y-3">
                  {pioneer.funFacts.map((f) => (
                    <li
                      key={f.id}
                      className="text-foreground flex gap-2.5 text-sm leading-relaxed"
                    >
                      <span className="bg-muted-foreground/40 mt-1.5 h-1.5 w-1.5 flex-none rounded-full" />
                      {f.fact}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Awards */}
            {pioneer.awards.length > 0 && (
              <Section title="Awards">
                <div className="space-y-2">
                  {pioneer.awards.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-foreground text-sm">{a.name}</span>
                      {a.year && (
                        <span className="text-muted-foreground font-mono text-xs">
                          {a.year}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Institutions */}
            {pioneer.institutions.length > 0 && (
              <Section title="Institutions">
                <div className="space-y-3">
                  {pioneer.institutions.map((inst) => (
                    <div key={inst.id}>
                      <p className="text-foreground text-sm font-medium">
                        {inst.name}
                      </p>
                      {inst.role && (
                        <p className="text-muted-foreground text-[11px]">
                          {inst.role}
                        </p>
                      )}
                      {inst.years && (
                        <p className="text-muted-foreground font-mono text-[11px]">
                          {inst.years}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Education */}
            {pioneer.education.length > 0 && (
              <Section title="Education">
                <div className="space-y-3">
                  {pioneer.education.map((e) => (
                    <div key={e.id}>
                      <p className="text-foreground text-sm font-medium">
                        {e.institution}
                      </p>
                      {e.degree && (
                        <p className="text-muted-foreground text-[11px]">
                          {e.degree}
                        </p>
                      )}
                      {e.year && (
                        <p className="text-muted-foreground font-mono text-[11px]">
                          {e.year}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Influences */}
            {(influencedBy.length > 0 || influenced.length > 0) && (
              <Section title="Influences">
                {influencedBy.length > 0 && (
                  <div className="mb-3">
                    <p className="text-muted-foreground mb-1.5 text-[10px] font-medium tracking-widest uppercase">
                      Influenced by
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {influencedBy.map((inf) => (
                        <InfluenceChip key={inf.id} name={inf.name} />
                      ))}
                    </div>
                  </div>
                )}
                {influenced.length > 0 && (
                  <div>
                    <p className="text-muted-foreground mb-1.5 text-[10px] font-medium tracking-widest uppercase">
                      Influenced
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {influenced.map((inf) => (
                        <InfluenceChip key={inf.id} name={inf.name} />
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* Related pioneers */}
      {related.length > 0 && (
        <div className="border-border border-t">
          <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
            <h2 className="text-muted-foreground mb-5 text-[10px] font-medium tracking-widest uppercase">
              Related Pioneers
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {related.map((r) => {
                const rImg = blobToProxyUrl(r.imageLocal);
                const rEraColor = ERA_COLORS[r.era] ?? "#888888";
                const rEraLabel = ERA_LABELS[r.era] ?? r.era;
                return (
                  <Link
                    key={r.id}
                    href={`/pioneer/${r.slug}`}
                    className="border-border bg-card hover:bg-accent group flex flex-col overflow-hidden rounded-lg border transition-colors"
                  >
                    <div className="bg-muted relative aspect-[3/4] w-full overflow-hidden">
                      {rImg ? (
                        <PioneerImage
                          src={rImg}
                          alt={r.name}
                          name={r.name}
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover object-top grayscale transition-all duration-300 group-hover:grayscale-0"
                        />
                      ) : (
                        <AvatarPlaceholder name={r.name} />
                      )}
                      <span
                        className="absolute bottom-1.5 left-1.5 rounded px-1 py-0.5 text-[9px] font-medium tracking-wide text-white uppercase"
                        style={{ backgroundColor: rEraColor }}
                      >
                        {rEraLabel}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-foreground line-clamp-1 text-[11px] font-semibold">
                        {r.name}
                      </p>
                      {r.knownFor && (
                        <p className="text-muted-foreground mt-0.5 line-clamp-2 text-[10px]">
                          {r.knownFor}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-muted-foreground mb-3 text-[10px] font-medium tracking-widest uppercase">
        {title}
      </h2>
      <div className="border-border bg-card rounded-lg border p-4">
        {children}
      </div>
    </div>
  );
}

function InfluenceChip({ name }: { name: string }) {
  return (
    <Link
      href={`/pioneer/${slugify(name)}`}
      className="border-border bg-muted text-muted-foreground hover:bg-accent hover:text-foreground rounded border px-2 py-0.5 text-[11px] transition-colors"
    >
      {name}
    </Link>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const pioneer = await db.pioneer.findUnique({
    where: { slug },
    select: { name: true, knownFor: true, intro: true },
  });
  if (!pioneer) return {};
  return {
    title: `${pioneer.name} — Pioneers in Computer Science`,
    description: pioneer.knownFor ?? pioneer.intro,
  };
}
