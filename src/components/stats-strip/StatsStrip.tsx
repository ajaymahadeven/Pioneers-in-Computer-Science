import type { StatsProps } from "@/types/pioneer";

const STATS = (p: StatsProps) => [
  { value: p.totalPioneers, label: "Pioneers" },
  { value: p.totalEras, label: "Eras of Computing" },
  { value: p.totalCountries, label: "Countries" },
  { value: p.totalFields, label: "Fields of Study" },
];

export function StatsStrip(props: StatsProps) {
  const stats = STATS(props);

  return (
    <section className="border-border bg-muted border-y">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <dl className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <dt className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                {label}
              </dt>
              <dd className="text-foreground font-mono text-3xl font-semibold tracking-tight tabular-nums">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
