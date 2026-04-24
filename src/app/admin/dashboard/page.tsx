import { db } from "@/server/db";

export default async function DashboardPage() {
  const [total, withImage, recentViews, eraCounts] = await Promise.all([
    db.pioneer.count(),
    db.pioneer.count({ where: { imageLocal: { not: null } } }),
    db.pioneerView.count({
      where: {
        viewedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    db.pioneer.groupBy({ by: ["era"], _count: { id: true } }),
  ]);

  const stats = [
    { label: "Total Pioneers", value: total },
    { label: "With Image", value: withImage },
    { label: "Views (7d)", value: recentViews },
    { label: "Eras", value: 7 },
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

      {/* Era breakdown */}
      <div className="border-border bg-card rounded-lg border">
        <div className="border-border border-b px-5 py-3">
          <h2 className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Pioneers by Era
          </h2>
        </div>
        <div className="divide-border divide-y">
          {eraCounts.map(({ era, _count }) => (
            <div
              key={era}
              className="flex items-center justify-between px-5 py-3"
            >
              <span className="text-foreground text-sm">{era}</span>
              <span className="text-muted-foreground font-mono text-sm">
                {_count.id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
