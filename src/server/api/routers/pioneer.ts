import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const ERA_META: Record<
  string,
  { label: string; range: string; color: string }
> = {
  AncientMedieval: {
    label: "Ancient & Medieval",
    range: "800 – 1400",
    color: "#8B5CF6",
  },
  Mechanical: {
    label: "Mechanical Computing",
    range: "1600 – 1900",
    color: "#EC4899",
  },
  EarlyElectronic: {
    label: "Early Electronic",
    range: "1930 – 1955",
    color: "#F59E0B",
  },
  ColdWar: {
    label: "Cold War Computing",
    range: "1955 – 1975",
    color: "#10B981",
  },
  PersonalComputing: {
    label: "Personal Computing",
    range: "1975 – 1995",
    color: "#3B82F6",
  },
  InternetAge: {
    label: "Internet Age",
    range: "1990 – 2005",
    color: "#6366F1",
  },
  AIEra: { label: "AI Era", range: "2000 – present", color: "#EF4444" },
};

export const pioneerRouter = createTRPCRouter({
  getFeatured: publicProcedure.query(async ({ ctx }) => {
    const total = await ctx.db.pioneer.count({
      where: { imageLocal: { not: null } },
    });
    const skip = Math.max(0, Math.floor(Math.random() * (total - 6)));

    return ctx.db.pioneer.findMany({
      where: { imageLocal: { not: null } },
      skip,
      take: 6,
      select: {
        id: true,
        name: true,
        knownFor: true,
        imageLocal: true,
        era: true,
        birthCountry: true,
        contributionYear: true,
        classifications: {
          take: 2,
          select: { classification: { select: { name: true } } },
        },
      },
    });
  }),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const [totalPioneers, countryRows, eraRows, classificationRows] =
      await Promise.all([
        ctx.db.pioneer.count(),
        ctx.db.pioneer.findMany({
          select: { birthCountry: true },
          distinct: ["birthCountry"],
        }),
        ctx.db.pioneer.groupBy({
          by: ["era"],
          _count: { id: true },
          orderBy: { era: "asc" },
        }),
        ctx.db.classification.findMany({
          select: {
            name: true,
            _count: { select: { pioneers: true } },
          },
          orderBy: { pioneers: { _count: "desc" } },
        }),
      ]);

    const eras = eraRows.map((row) => ({
      era: row.era,
      count: row._count.id,
      ...ERA_META[row.era],
    }));

    const classifications = classificationRows.map((c) => ({
      name: c.name,
      count: c._count.pioneers,
    }));

    return {
      totalPioneers,
      totalCountries: countryRows.length,
      totalEras: 7,
      totalFields: classifications.length,
      eras,
      classifications,
    };
  }),

  getEraRepresentatives: publicProcedure.query(async ({ ctx }) => {
    const eras = Object.keys(ERA_META);
    const results = await Promise.all(
      eras.map((era) =>
        ctx.db.pioneer.findFirst({
          where: { era: era as never, imageLocal: { not: null } },
          orderBy: { contributionYear: "asc" },
          select: { id: true, name: true, imageLocal: true, era: true },
        }),
      ),
    );
    return eras.map((era, i) => ({
      era,
      pioneer: results[i],
      ...ERA_META[era],
    }));
  }),

  getFunFact: publicProcedure.query(async ({ ctx }) => {
    const count = await ctx.db.pioneer.count({
      where: { funFacts: { some: {} }, imageLocal: { not: null } },
    });
    const skip = Math.floor(Math.random() * count);
    const pioneer = await ctx.db.pioneer.findFirst({
      where: { funFacts: { some: {} }, imageLocal: { not: null } },
      skip,
      select: {
        id: true,
        name: true,
        imageLocal: true,
        funFacts: { orderBy: { order: "asc" }, take: 3 },
      },
    });
    return pioneer;
  }),

  getMapPoints: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.pioneer.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        era: true,
      },
    });
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const name = input.slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      return ctx.db.pioneer.findFirst({
        where: { name: { equals: name, mode: "insensitive" } },
        include: {
          classifications: {
            include: { classification: true },
          },
          education: { orderBy: { year: "asc" } },
          awards: { orderBy: { year: "asc" } },
          institutions: true,
          notableWorks: { orderBy: { year: "asc" } },
          funFacts: { orderBy: { order: "asc" } },
          influences: true,
        },
      });
    }),
});
