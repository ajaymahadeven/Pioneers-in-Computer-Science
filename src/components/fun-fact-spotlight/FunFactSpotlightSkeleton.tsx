import { Skeleton } from "@/components/ui/skeleton";

export function FunFactSpotlightSkeleton() {
  return (
    <section className="bg-[#1a1a1a] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-2">
          <Skeleton className="h-3.5 w-20 rounded bg-white/10" />
          <Skeleton className="h-8 w-72 rounded bg-white/10" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#222222]">
          <div className="flex flex-col gap-8 p-8 sm:flex-row sm:items-center">
            <Skeleton className="h-48 w-48 flex-none rounded-xl bg-white/8" />
            <div className="flex flex-1 flex-col gap-4">
              <Skeleton className="h-4 w-full rounded bg-white/8" />
              <Skeleton className="h-4 w-5/6 rounded bg-white/8" />
              <Skeleton className="h-4 w-4/5 rounded bg-white/8" />
              <Skeleton className="mt-2 h-4 w-1/3 rounded bg-white/8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
