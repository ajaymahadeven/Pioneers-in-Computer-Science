import { Skeleton } from "@/components/ui/skeleton";

export function HeroSectionSkeleton() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-[#141414]">
      <div className="dot-grid absolute inset-0 opacity-100" />
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-center px-6 py-24 lg:px-8">
        <div className="flex flex-1 flex-col gap-8 lg:max-w-[52%]">
          <Skeleton className="h-6 w-48 rounded-full bg-white/10" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-14 w-full rounded-lg bg-white/10" />
            <Skeleton className="h-14 w-4/5 rounded-lg bg-white/10" />
          </div>
          <Skeleton className="h-16 w-full rounded-lg bg-white/8" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-44 rounded-full bg-white/10" />
            <Skeleton className="h-11 w-44 rounded-full bg-white/8" />
          </div>
        </div>
      </div>
    </section>
  );
}
