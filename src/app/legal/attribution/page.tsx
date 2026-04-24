import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/server/db";

export const metadata: Metadata = {
  title: "Attribution",
  description:
    "Image credits, data sources, and licensing for Pioneers in Computer Science.",
};

export default async function AttributionPage() {
  // Pioneers with a known image source/license
  const credited = await db.pioneer.findMany({
    where: { imageSource: { not: null } },
    select: {
      id: true,
      name: true,
      slug: true,
      imageSource: true,
      imageLicense: true,
    },
    orderBy: { name: "asc" },
  });

  const withoutSource = await db.pioneer.count({
    where: { imageLocal: { not: null }, imageSource: null },
  });

  return (
    <div className="bg-background min-h-screen">
      <div className="border-border border-b">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
          <p className="text-muted-foreground mb-2 text-[10px] font-medium tracking-widest uppercase">
            Legal
          </p>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            Attribution
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Image credits, data sources, and licensing.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 md:px-6">
        {/* Data */}
        <div>
          <h2 className="text-foreground mb-3 text-base font-semibold">
            Biographical Data
          </h2>
          <div className="border-border bg-card space-y-3 rounded-lg border p-5 text-sm">
            <p className="text-muted-foreground leading-relaxed">
              Biographical facts (birth/death years, countries, achievements)
              are drawn from{" "}
              <a
                href="https://www.wikidata.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                Wikidata
              </a>{" "}
              (CC0) and{" "}
              <a
                href="https://en.wikipedia.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                Wikipedia
              </a>{" "}
              (CC BY-SA 4.0). Introductions and biographical summaries have been
              written or paraphrased originally for this site.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Where Wikipedia text is quoted verbatim it is used under{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
              >
                CC BY-SA 4.0
              </a>
              . This site&apos;s content is likewise available under CC BY-SA
              4.0 unless otherwise noted.
            </p>
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-foreground mb-3 text-base font-semibold">
            Portrait Images
          </h2>

          {withoutSource > 0 && (
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/8 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              {withoutSource} portrait
              {withoutSource === 1 ? "" : "s"} are missing source attribution
              and are under review. They will be replaced or credited as soon as
              provenance is confirmed.
            </div>
          )}

          {credited.length > 0 ? (
            <div className="border-border bg-card rounded-lg border">
              <div className="border-border grid grid-cols-[1fr_1fr_auto] gap-4 border-b px-4 py-2.5 text-[10px] font-medium tracking-widest text-white/50 uppercase">
                <span>Pioneer</span>
                <span>Source</span>
                <span>License</span>
              </div>
              <div className="divide-border divide-y">
                {credited.map((p) => (
                  <div
                    key={p.id}
                    className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 px-4 py-3"
                  >
                    <Link
                      href={`/pioneer/${p.slug}`}
                      className="text-foreground truncate text-sm hover:underline"
                    >
                      {p.name}
                    </Link>
                    <span className="text-muted-foreground truncate text-xs">
                      {p.imageSource}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {p.imageLicense ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border-border bg-card rounded-lg border px-4 py-8 text-center">
              <p className="text-muted-foreground text-sm">
                Image source records are being populated. Check back soon.
              </p>
            </div>
          )}
        </div>

        {/* Licenses */}
        <div>
          <h2 className="text-foreground mb-3 text-base font-semibold">
            Common Licenses Used
          </h2>
          <div className="border-border bg-card divide-border divide-y rounded-lg border text-sm">
            {[
              {
                id: "CC0",
                label: "CC0 1.0 Universal",
                desc: "Public domain dedication — no rights reserved.",
                url: "https://creativecommons.org/publicdomain/zero/1.0/",
              },
              {
                id: "CC-BY",
                label: "CC BY 4.0",
                desc: "Free to use with attribution.",
                url: "https://creativecommons.org/licenses/by/4.0/",
              },
              {
                id: "CC-BY-SA",
                label: "CC BY-SA 4.0",
                desc: "Free to use with attribution; derivatives must share alike.",
                url: "https://creativecommons.org/licenses/by-sa/4.0/",
              },
              {
                id: "PD",
                label: "Public Domain",
                desc: "Copyright expired or never applied.",
                url: "https://en.wikipedia.org/wiki/Public_domain",
              },
            ].map(({ id, label, desc, url }) => (
              <div key={id} className="flex items-start gap-4 px-4 py-3">
                <span className="border-border bg-muted text-muted-foreground mt-0.5 flex-none rounded border px-1.5 py-0.5 font-mono text-[10px]">
                  {id}
                </span>
                <div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-medium underline-offset-4 hover:underline"
                  >
                    {label}
                  </a>
                  <p className="text-muted-foreground mt-0.5 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border border-t pt-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
