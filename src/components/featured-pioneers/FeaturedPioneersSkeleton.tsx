import { PioneerCardSkeleton } from "@/components/pioneer-card/PioneerCardSkeleton";

export function FeaturedPioneersSkeleton() {
  return (
    <section className="bg-white py-20 dark:bg-[#1e1e1e]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-3.5 w-16 rounded bg-[#eeece8] dark:bg-[#2c2c2c]" />
            <div className="h-8 w-48 rounded bg-[#eeece8] dark:bg-[#2c2c2c]" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PioneerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
