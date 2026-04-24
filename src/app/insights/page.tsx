import { db } from "@/server/db";
import { ERA_COLORS, ERA_LABELS } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const total = await db.pioneer.count();
  return {
    title: "Insights",
    description: `Data-driven insights into ${total} pioneers in computer science — eras, countries, fields, and more.`,
  };
}

export default async function InsightsPage() {
  const [
    total,
    eraCounts,
    genderCounts,
    countryCounts,
    fieldCounts,
    decadeCounts,
    withImage,
    withBio,
    withAwards,
  ] = await Promise.all([
    db.pioneer.count(),
    db.pioneer.groupBy({
      by: ["era"],
      _count: { id: true },
      orderBy: { era: "asc" },
    }),
    db.pioneer.groupBy({ by: ["gender"], _count: { id: true } }),
    db.pioneer.groupBy({
      by: ["birthCountry"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 12,
    }),
    db.classification.findMany({
      select: {
        name: true,
        _count: { select: { pioneers: true } },
      },
      orderBy: { pioneers: { _count: "desc" } },
      take: 15,
    }),
    db.pioneer.groupBy({
      by: ["contributionYear"],
      _count: { id: true },
      orderBy: { contributionYear: "asc" },
    }),
    db.pioneer.count({ where: { imageLocal: { not: null } } }),
    db.pioneer.count({ where: { longBio: { not: null } } }),
    db.pioneer.count({ where: { awards: { some: {} } } }),
  ]);

  // Bucket contribution years into decades
  const decades: Record<string, number> = {};
  for (const { contributionYear, _count } of decadeCounts) {
    if (!contributionYear) continue;
    const decade =
      contributionYear < 1900
        ? `${Math.floor(contributionYear / 100) + 1}th C.`
        : `${Math.floor(contributionYear / 10) * 10}s`;
    decades[decade] = (decades[decade] ?? 0) + _count.id;
  }
  const decadeEntries = Object.entries(decades);
  const maxDecade = Math.max(...decadeEntries.map(([, v]) => v));

  const maxCountry = Math.max(...countryCounts.map((c) => c._count.id));
  const maxField = Math.max(...fieldCounts.map((f) => f._count.pioneers));
  const maxEra = Math.max(...eraCounts.map((e) => e._count.id));

  const completeness = [
    { label: "Portrait photo", count: withImage },
    { label: "Full biography", count: withBio },
    { label: "Awards", count: withAwards },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="border-border border-b">
        <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
          <p className="text-muted-foreground mb-2 text-[10px] font-medium tracking-widest uppercase">
            Data Insights
          </p>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            {total} Pioneers, By the Numbers
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Patterns across 12 centuries of computer science history.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-10 px-4 py-12 md:px-6">
        {/* Completeness strip */}
        <div className="grid grid-cols-3 gap-4">
          {completeness.map(({ label, count }) => {
            const pct = Math.round((count / total) * 100);
            return (
              <div
                key={label}
                className="border-border bg-card rounded-lg border p-5"
              >
                <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-widest uppercase">
                  {label}
                </p>
                <p className="text-foreground font-mono text-3xl font-semibold">
                  {pct}%
                </p>
                <p className="text-muted-foreground mt-0.5 text-[11px]">
                  {count} of {total}
                </p>
                <div className="bg-muted mt-3 h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-foreground/60 h-full rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Era distribution */}
        <Section title="Distribution by Era">
          <div className="space-y-2.5">
            {eraCounts.map(({ era, _count }) => {
              const color = ERA_COLORS[era] ?? "#888888";
              const label = ERA_LABELS[era] ?? era;
              const pct = (_count.id / maxEra) * 100;
              return (
                <div key={era} className="flex items-center gap-3">
                  <span
                    className="w-36 flex-none text-right font-mono text-[11px]"
                    style={{ color }}
                  >
                    {label}
                  </span>
                  <div className="bg-muted h-5 flex-1 overflow-hidden rounded">
                    <div
                      className="flex h-full items-center justify-end rounded pr-2 transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: color + "33",
                        borderRight: `3px solid ${color}`,
                      }}
                    >
                      <span
                        className="font-mono text-[10px] font-semibold"
                        style={{ color }}
                      >
                        {_count.id}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Two-column: gender + completeness */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Gender breakdown */}
          <Section title="Gender Breakdown">
            <div className="space-y-3">
              {genderCounts.map(({ gender, _count }) => {
                const pct = Math.round((_count.id / total) * 100);
                const colors: Record<string, string> = {
                  Male: "#2980b9",
                  Female: "#c0392b",
                  Unknown: "#888888",
                };
                const color = colors[gender] ?? "#888888";
                return (
                  <div key={gender}>
                    <div className="mb-1 flex justify-between font-mono text-xs">
                      <span className="text-foreground">{gender}</span>
                      <span className="text-muted-foreground">
                        {_count.id} · {pct}%
                      </span>
                    </div>
                    <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Contribution decade density */}
          <Section title="Activity by Decade">
            <div className="flex h-32 items-end gap-1">
              {decadeEntries.map(([decade, count]) => {
                const h = Math.round((count / maxDecade) * 100);
                return (
                  <div
                    key={decade}
                    className="group flex flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-muted-foreground hidden font-mono text-[8px] group-hover:block">
                      {count}
                    </span>
                    <div
                      className="bg-foreground/20 hover:bg-foreground/40 w-full rounded-t transition-colors"
                      style={{ height: `${h}%` }}
                      title={`${decade}: ${count}`}
                    />
                    <span
                      className="text-muted-foreground font-mono text-[8px]"
                      style={{ writingMode: "vertical-rl" }}
                    >
                      {decade}
                    </span>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>

        {/* Top countries */}
        <Section title="Top Countries of Origin">
          <div className="grid gap-2 sm:grid-cols-2">
            {countryCounts.map(({ birthCountry, _count }) => {
              const pct = (_count.id / maxCountry) * 100;
              return (
                <div key={birthCountry} className="flex items-center gap-3">
                  <span className="text-foreground w-32 flex-none truncate text-xs">
                    {birthCountry}
                  </span>
                  <div className="bg-muted h-4 flex-1 overflow-hidden rounded">
                    <div
                      className="flex h-full items-center justify-end rounded pr-1.5 transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: "hsl(var(--foreground) / 0.12)",
                        borderRight: "2px solid hsl(var(--foreground) / 0.4)",
                      }}
                    >
                      <span className="text-muted-foreground font-mono text-[9px]">
                        {_count.id}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* Top fields */}
        <Section title="Top Fields of Work">
          <div className="space-y-2">
            {fieldCounts.map((f, i) => {
              const pct = (f._count.pioneers / maxField) * 100;
              return (
                <div key={f.name} className="flex items-center gap-3">
                  <span className="text-muted-foreground w-5 flex-none text-right font-mono text-[10px]">
                    {i + 1}
                  </span>
                  <span className="text-foreground w-48 flex-none truncate text-xs">
                    {f.name}
                  </span>
                  <div className="bg-muted h-4 flex-1 overflow-hidden rounded">
                    <div
                      className="h-full rounded transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: "hsl(var(--foreground) / 0.15)",
                      }}
                    />
                  </div>
                  <span className="text-muted-foreground w-6 flex-none text-right font-mono text-[10px]">
                    {f._count.pioneers}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      </div>
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
      <div className="border-border bg-card rounded-lg border p-5">
        {children}
      </div>
    </div>
  );
}
