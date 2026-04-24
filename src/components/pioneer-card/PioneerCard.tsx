import Link from "next/link";
import { ERA_LABELS, ERA_COLORS, slugify, blobToProxyUrl } from "@/lib/utils";
import { PioneerImage } from "@/components/avatar-placeholder/PioneerImage";
import { AvatarPlaceholder } from "@/components/avatar-placeholder/AvatarPlaceholder";
import type { PioneerCardProps } from "@/types/pioneer";

export function PioneerCard({
  name,
  knownFor,
  imageLocal,
  era,
  birthCountry,
  classifications,
}: PioneerCardProps) {
  const slug = slugify(name);
  const eraLabel = ERA_LABELS[era] ?? era;
  const eraColor = ERA_COLORS[era] ?? "#888888";
  const imageSrc = blobToProxyUrl(imageLocal);

  return (
    <Link href={`/pioneer/${slug}`} className="group block h-full">
      <div className="border-border bg-card hover:bg-accent flex h-full flex-col overflow-hidden rounded-lg border shadow-sm transition-colors">
        {/* Portrait */}
        <div className="bg-muted relative aspect-[4/3] w-full overflow-hidden">
          {imageSrc ? (
            <PioneerImage
              src={imageSrc}
              alt={name}
              name={name}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top grayscale transition-all duration-500 group-hover:grayscale-0"
            />
          ) : (
            <AvatarPlaceholder name={name} />
          )}
          <span
            className="absolute bottom-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase"
            style={{ backgroundColor: eraColor }}
          >
            {eraLabel}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div>
            <h3 className="text-foreground line-clamp-1 text-sm font-semibold">
              {name}
            </h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {birthCountry}
            </p>
          </div>

          {knownFor && (
            <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {knownFor}
            </p>
          )}

          {classifications.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-1 pt-1">
              {classifications.slice(0, 2).map(({ classification }) => (
                <span
                  key={classification.name}
                  className="border-border bg-muted text-muted-foreground rounded border px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase"
                >
                  {classification.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
