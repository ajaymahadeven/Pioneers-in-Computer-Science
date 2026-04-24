import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PioneerCard } from "@/components/pioneer-card/PioneerCard";
import type { FeaturedPioneer } from "@/types/pioneer";

export function FeaturedPioneers({
  pioneers,
}: {
  pioneers: FeaturedPioneer[];
}) {
  return (
    <section className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-widest uppercase">
              Featured
            </p>
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              Meet the Pioneers
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
          >
            View all 184 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pioneers.map((pioneer) => (
            <PioneerCard key={pioneer.id} {...pioneer} />
          ))}
        </div>
      </div>
    </section>
  );
}
