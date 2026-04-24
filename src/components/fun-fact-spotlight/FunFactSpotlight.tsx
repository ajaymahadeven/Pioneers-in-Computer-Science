"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { slugify, blobToProxyUrl } from "@/lib/utils";
import { PioneerImage } from "@/components/avatar-placeholder/PioneerImage";
import { AvatarPlaceholder } from "@/components/avatar-placeholder/AvatarPlaceholder";
import type { FunFactPioneer } from "@/types/pioneer";

export function FunFactSpotlight({ pioneer }: { pioneer: FunFactPioneer }) {
  const [current, setCurrent] = useState(0);
  const facts = pioneer.funFacts;

  useEffect(() => {
    if (facts.length <= 1) return;
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % facts.length),
      4000,
    );
    return () => clearInterval(id);
  }, [facts.length]);

  const fact = facts[current];
  if (!fact) return null;

  const imageSrc = blobToProxyUrl(pioneer.imageLocal);

  return (
    <section className="bg-black py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8">
          <p className="mb-1.5 text-xs font-medium tracking-widest text-white/35 uppercase">
            Did you know?
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Surprising stories from history
          </h2>
        </div>

        <div className="overflow-hidden rounded-lg border border-white/10 bg-[#141414]">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
            {/* Portrait */}
            <Link
              href={`/pioneer/${slugify(pioneer.name)}`}
              className="group relative h-40 w-40 flex-none overflow-hidden rounded-lg border border-white/10"
            >
              {imageSrc ? (
                <PioneerImage
                  src={imageSrc}
                  alt={pioneer.name}
                  name={pioneer.name}
                  sizes="160px"
                  className="object-cover object-top grayscale transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <AvatarPlaceholder name={pioneer.name} />
              )}
            </Link>

            {/* Fact */}
            <div className="flex flex-1 flex-col gap-5">
              <p className="text-base leading-relaxed text-white/70">
                {fact.fact}
              </p>

              <div className="flex items-center justify-between border-t border-white/8 pt-4">
                <Link
                  href={`/pioneer/${slugify(pioneer.name)}`}
                  className="flex items-center gap-1 text-sm font-medium text-white/50 transition-colors hover:text-white"
                >
                  {pioneer.name} <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {facts.length > 1 && (
                  <div className="flex gap-1.5">
                    {facts.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`h-1 rounded-sm transition-all duration-300 ${
                          i === current ? "w-4 bg-white" : "w-1 bg-white/20"
                        }`}
                        aria-label={`Fact ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
