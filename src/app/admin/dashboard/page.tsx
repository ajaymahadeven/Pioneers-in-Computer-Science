import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { db } from "@/server/db";
import { ERA_LABELS } from "@/lib/utils";

export default async function DashboardPage() {
  const [
    total,
    withImage,
    recentViews,
    eraCounts,
    withBio,
    withAwards,
    withInstitutions,
    withClassifications,
    incomplete,
  ] = await Promise.all([
    db.pioneer.count(),
    db.pioneer.count({ where: { imageLocal: { not: null } } }),
    db.pioneerView.count({
      where: {
        viewedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    db.pioneer.groupBy({ by: ["era"], _count: { id: true } }),
    db.pioneer.count({ where: { longBio: { not: null } } }),
    db.pioneer.count({ where: { awards: { some: {} } } }),
    db.pioneer.count({ where: { institutions: { some: {} } } }),
    db.pioneer.count({ where: { classifications: { some: {} } } }),
    // Pioneers missing the most data
    db.pioneer.findMany({
      where: { imageLocal: null },
      select: { id: true, name: true, era: true, contributionYear: true },
      orderBy: { contributionYear: "asc" },
      take: 10,
    }),
  ]);

  const stats = [
    { label: "Total Pioneers", value: total },
    { label: "With Image", value: withImage },
    { label: "Views (7d)", value: recentViews },
    { label: "Eras", value: eraCounts.length },
  ];

  const completeness = [
    { label: "Portrait photo", count: withImage },
    { label: "Full biography", count: withBio },
    { label: "Awards", count: withAwards },
    { label: "Institutions", count: withInstitutions },
    { label: "Classifications", count: withClassifications },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-widest uppercase">
          Overview
        </p>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="border-border bg-card rounded-lg border p-5"
          >
            <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-widest uppercase">
              {label}
            </p>
            <p className="text-foreground font-mono text-3xl font-semibold">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Era breakdown */}
        <div className="border-border bg-card rounded-lg border">
          <div className="border-border border-b px-5 py-3">
            <h2 className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Pioneers by Era
            </h2>
          </div>
          <div className="divide-border divide-y">
            {eraCounts.map(({ era, _count }) => {
              const pct = Math.round((_count.id / total) * 100);
              return (
                <div
                  key={era}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="text-foreground text-sm">
                    {ERA_LABELS[era] ?? era}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="bg-muted hidden h-1.5 w-20 overflow-hidden rounded-full sm:block">
                      <div
                        className="bg-foreground/50 h-full rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground w-8 text-right font-mono text-sm">
                      {_count.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data completeness */}
        <div className="border-border bg-card rounded-lg border">
          <div className="border-border border-b px-5 py-3">
            <h2 className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Data Completeness
            </h2>
          </div>
          <div className="divide-border divide-y">
            {completeness.map(({ label, count }) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div
                  key={label}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <span className="text-foreground text-sm">{label}</span>
                  <div className="flex items-center gap-3">
                    <div className="bg-muted hidden h-1.5 w-20 overflow-hidden rounded-full sm:block">
                      <div
                        className={`h-full rounded-full ${
                          pct >= 80
                            ? "bg-green-500"
                            : pct >= 50
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span
                      className={`w-12 text-right font-mono text-sm ${
                        pct >= 80
                          ? "text-green-600 dark:text-green-400"
                          : pct >= 50
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Missing portraits */}
      {incomplete.length > 0 && (
        <div className="border-border bg-card mt-6 rounded-lg border">
          <div className="border-border flex items-center gap-2 border-b px-5 py-3">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            <h2 className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Missing Portrait — Needs Attention
            </h2>
          </div>
          <div className="divide-border divide-y">
            {incomplete.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-foreground text-sm">{p.name}</p>
                  <p className="text-muted-foreground font-mono text-[11px]">
                    {ERA_LABELS[p.era] ?? p.era} · {p.contributionYear}
                  </p>
                </div>
                <Link
                  href={`/admin/dashboard/pioneers/${p.id}/edit`}
                  className="border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded border px-3 py-1 text-[11px] transition-colors"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
          <div className="border-border border-t px-5 py-3">
            <Link
              href="/admin/dashboard/pioneers"
              className="text-muted-foreground hover:text-foreground text-xs underline-offset-2 hover:underline"
            >
              View all pioneers →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
