import Link from "next/link";
import type { Classification } from "@/types/pioneer";

export function FieldsCloud({
  classifications,
}: {
  classifications: Classification[];
}) {
  const max = Math.max(...classifications.map((c) => c.count));
  const min = Math.min(...classifications.map((c) => c.count));

  function fontSize(count: number) {
    const ratio = (count - min) / Math.max(max - min, 1);
    return `${(12 + ratio * 9).toFixed(1)}px`;
  }

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8">
          <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-widest uppercase">
            {classifications.length} Disciplines
          </p>
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            What field are you curious about?
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Larger tags have more pioneers.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {classifications.map(({ name, count }) => (
            <Link
              key={name}
              href={`/explore?field=${encodeURIComponent(name)}`}
              style={{ fontSize: fontSize(count) }}
              className="border-border bg-card text-foreground hover:bg-foreground hover:text-background rounded-md border px-3 py-1.5 font-medium transition-colors"
            >
              {name}
              <span className="ml-1 font-mono opacity-30">{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
