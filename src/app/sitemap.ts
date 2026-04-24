import type { MetadataRoute } from "next";
import { db } from "@/server/db";
import { env } from "@/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_APP_URL;

  const pioneers = await db.pioneer.findMany({
    select: { slug: true, contributionYear: true },
    orderBy: { contributionYear: "asc" },
  });

  const pioneerEntries: MetadataRoute.Sitemap = pioneers.map((p) => ({
    url: `${base}/pioneer/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/explore`, changeFrequency: "daily", priority: 0.9 },
  ];

  return [...staticPages, ...pioneerEntries];
}
