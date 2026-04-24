import { Skeleton } from "@/components/ui/skeleton";

export function WorldMapSkeleton() {
  return (
    <section className="bg-white py-20 dark:bg-[#1e1e1e]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-8 w-56 rounded" />
          <Skeleton className="h-4 w-40 rounded" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#dddbd5] dark:border-[#2c2c2c]">
          <Skeleton className="aspect-[2/1] w-full rounded-none bg-[#1a1a1a]" />
          <div className="flex flex-wrap gap-4 border-t border-[#dddbd5] px-6 py-4 dark:border-[#2c2c2c]">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-20 rounded" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
