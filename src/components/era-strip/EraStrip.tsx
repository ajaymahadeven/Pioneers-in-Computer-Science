import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ERA_LABELS, ERA_COLORS, blobToProxyUrl } from "@/lib/utils";
import { PioneerImage } from "@/components/avatar-placeholder/PioneerImage";
import { AvatarPlaceholder } from "@/components/avatar-placeholder/AvatarPlaceholder";
import type { EraMeta } from "@/types/pioneer";

export function EraStrip({ eras }: { eras: EraMeta[] }) {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-muted-foreground mb-1.5 text-xs font-medium tracking-widest uppercase">
              Through History
            </p>
            <h2 className="text-foreground text-2xl font-semibold tracking-tight">
              7 Eras of Computing
            </h2>
          </div>
          <Link
            href="/explore"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
          >
            Browse all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-3 md:-mx-6 md:px-6">
          {eras.map(({ era, count, range, pioneer }) => {
            const proxyImg = blobToProxyUrl(pioneer?.imageLocal ?? null);
            const eraColor = ERA_COLORS[era] ?? "#888888";
            return (
              <Link
                key={era}
                href={`/explore?era=${era}`}
                className="group border-border bg-card hover:bg-accent flex w-48 flex-none flex-col overflow-hidden rounded-lg border shadow-sm transition-colors"
              >
                <div className="bg-muted relative h-32 overflow-hidden">
                  {proxyImg ? (
                    <PioneerImage
                      src={proxyImg}
                      alt={pioneer!.name}
                      name={pioneer!.name}
                      sizes="192px"
                      className="object-cover object-top opacity-70 grayscale transition-opacity duration-300 group-hover:opacity-90"
                    />
                  ) : (
                    <AvatarPlaceholder name={pioneer?.name ?? ""} />
                  )}
                  <span
                    className="absolute top-2 right-2 rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white"
                    style={{ backgroundColor: eraColor }}
                  >
                    {count}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 p-3">
                  <h3 className="text-foreground text-sm font-medium">
                    {ERA_LABELS[era] ?? era}
                  </h3>
                  {range && (
                    <p className="text-muted-foreground font-mono text-xs">
                      {range}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
