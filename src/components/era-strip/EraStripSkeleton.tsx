import { Skeleton } from "@/components/ui/skeleton";

export function EraStripSkeleton() {
  return (
    <section className="bg-[#f7f6f2] py-20 dark:bg-[#141414]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2">
          <Skeleton className="h-3.5 w-24 rounded" />
          <Skeleton className="h-8 w-52 rounded" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-52 flex-none overflow-hidden rounded-2xl border border-[#dddbd5] dark:border-[#2c2c2c]"
            >
              <Skeleton className="h-36 w-full rounded-none" />
              <div className="flex flex-col gap-1.5 p-4">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
