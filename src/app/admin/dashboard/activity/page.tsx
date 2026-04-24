import { db } from "@/server/db";

export default async function ActivityPage() {
  const [recentViews, topPioneers, dailyCounts] = await Promise.all([
    db.pioneerView.findMany({
      orderBy: { viewedAt: "desc" },
      take: 50,
      include: { pioneer: { select: { name: true } } },
    }),
    db.pioneerView.groupBy({
      by: ["pioneerId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
      where: {
        viewedAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    db.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT DATE("viewedAt") as day, COUNT(*) as count
      FROM "PioneerView"
      WHERE "viewedAt" >= NOW() - INTERVAL '14 days'
      GROUP BY DATE("viewedAt")
      ORDER BY day DESC
    `,
  ]);

  const topWithNames = await Promise.all(
    topPioneers.map(async (row) => {
      const p = await db.pioneer.findUnique({
        where: { id: row.pioneerId },
        select: { name: true },
      });
      return { name: p?.name ?? "Unknown", views: row._count.id };
    }),
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-muted-foreground mb-1 text-[10px] font-medium tracking-widest uppercase">
          Analytics
        </p>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          User Activity
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top pioneers (30d) */}
        <div className="border-border bg-card rounded-lg border">
          <div className="border-border border-b px-5 py-3">
            <h2 className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Top Viewed — 30 days
            </h2>
          </div>
          <div className="divide-border divide-y">
            {topWithNames.map(({ name, views }, i) => (
              <div key={name} className="flex items-center gap-3 px-5 py-3">
                <span className="text-muted-foreground w-5 font-mono text-xs">
                  {i + 1}
                </span>
                <span className="text-foreground flex-1 text-sm">{name}</span>
                <span className="text-muted-foreground font-mono text-xs">
                  {views}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily views (14d) */}
        <div className="border-border bg-card rounded-lg border">
          <div className="border-border border-b px-5 py-3">
            <h2 className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
              Daily Views — 14 days
            </h2>
          </div>
          <div className="divide-border divide-y">
            {dailyCounts.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3"
              >
                <span className="text-muted-foreground font-mono text-xs">
                  {new Date(row.day).toISOString().slice(0, 10)}
                </span>
                <span className="text-foreground font-mono text-xs">
                  {String(row.count)}
                </span>
              </div>
            ))}
            {dailyCounts.length === 0 && (
              <p className="text-muted-foreground px-5 py-4 text-sm">
                No views recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent events */}
      <div className="border-border bg-card mt-6 rounded-lg border">
        <div className="border-border border-b px-5 py-3">
          <h2 className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
            Recent Views
          </h2>
        </div>
        <div className="divide-border divide-y">
          {recentViews.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between px-5 py-3"
            >
              <span className="text-foreground text-sm">{v.pioneer.name}</span>
              <span className="text-muted-foreground font-mono text-[11px]">
                {new Date(v.viewedAt).toLocaleString()}
              </span>
            </div>
          ))}
          {recentViews.length === 0 && (
            <p className="text-muted-foreground px-5 py-4 text-sm">
              No activity yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
