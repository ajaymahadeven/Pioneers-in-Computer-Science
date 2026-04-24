import { Skeleton } from "@/components/ui/skeleton";

export function PioneerCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-[#dddbd5] dark:border-[#2c2c2c]">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-3.5 w-1/3 rounded" />
        <Skeleton className="h-8 w-full rounded" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
