"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/server/db";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSession,
} from "@/app/_lib/admin-session";
import { slugify } from "@/lib/utils";
import type { WorkType } from "../../../../generated/prisma";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) throw new Error("Unauthenticated");
  const session = await verifyAdminSession(token);
  if (!session) throw new Error("Invalid session");
  return session;
}

const PioneerSchema = z.object({
  name: z.string().min(1),
  imageLocal: z.string().url().optional(),
  knownFor: z.string().optional(),
  intro: z.string().min(1),
  longBio: z.string().optional(),
  achievement: z.string().min(1),
  birthYear: z.coerce.number().int().optional(),
  deathYear: z.coerce.number().int().optional(),
  birthCity: z.string().optional(),
  birthCountry: z.string().min(1),
  nationality: z.string().optional(),
  century: z.coerce.number().int(),
  contributionYear: z.coerce.number().int(),
  era: z.enum([
    "AncientMedieval",
    "Mechanical",
    "EarlyElectronic",
    "ColdWar",
    "PersonalComputing",
    "InternetAge",
    "AIEra",
  ]),
  gender: z.enum(["Male", "Female", "Unknown"]),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  classifications: z.array(z.string()).default([]),
  funFacts: z.array(z.string()).default([]),
  awards: z
    .array(
      z.object({ name: z.string(), year: z.coerce.number().int().optional() }),
    )
    .default([]),
  institutions: z
    .array(
      z.object({
        name: z.string(),
        role: z.string().optional(),
        years: z.string().optional(),
      }),
    )
    .default([]),
  notableWorks: z
    .array(
      z.object({
        title: z.string(),
        type: z.string().default("Other"),
        year: z.coerce.number().int().optional(),
      }),
    )
    .default([]),
});

export async function createPioneer(formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name"),
    imageLocal: formData.get("imageLocal") ?? undefined,
    knownFor: formData.get("knownFor") ?? undefined,
    intro: formData.get("intro"),
    longBio: formData.get("longBio") ?? undefined,
    achievement: formData.get("achievement"),
    birthYear: formData.get("birthYear") ?? undefined,
    deathYear: formData.get("deathYear") ?? undefined,
    birthCity: formData.get("birthCity") ?? undefined,
    birthCountry: formData.get("birthCountry"),
    nationality: formData.get("nationality") ?? undefined,
    century: formData.get("century"),
    contributionYear: formData.get("contributionYear"),
    era: formData.get("era"),
    gender: formData.get("gender"),
    latitude: formData.get("latitude") ?? undefined,
    longitude: formData.get("longitude") ?? undefined,
    classifications: formData
      .getAll("classifications")
      .filter(Boolean) as string[],
    funFacts: formData.getAll("funFacts").filter(Boolean) as string[],
    awards: JSON.parse((formData.get("awards") as string) ?? "[]") as {
      name: string;
      year?: number;
    }[],
    institutions: JSON.parse(
      (formData.get("institutions") as string) ?? "[]",
    ) as { name: string; role?: string; years?: string }[],
    notableWorks: JSON.parse(
      (formData.get("notableWorks") as string) ?? "[]",
    ) as { title: string; type?: string; year?: number }[],
  };

  const data = PioneerSchema.parse(raw);

  await db.pioneer.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      imageLocal: data.imageLocal,
      knownFor: data.knownFor,
      intro: data.intro,
      longBio: data.longBio,
      achievement: data.achievement,
      birthYear: data.birthYear,
      deathYear: data.deathYear,
      birthCity: data.birthCity,
      birthCountry: data.birthCountry,
      nationality: data.nationality,
      century: data.century,
      contributionYear: data.contributionYear,
      era: data.era,
      gender: data.gender,
      latitude: data.latitude,
      longitude: data.longitude,
      classifications: {
        create: await Promise.all(
          data.classifications.map(async (name) => {
            const cls = await db.classification.upsert({
              where: { name },
              update: {},
              create: { name },
            });
            return { classificationId: cls.id };
          }),
        ),
      },
      funFacts: {
        create: data.funFacts.map((fact, i) => ({ fact, order: i })),
      },
      awards: {
        create: data.awards,
      },
      institutions: {
        create: data.institutions,
      },
      notableWorks: {
        create: data.notableWorks.map((w) => ({
          ...w,
          type: w.type as WorkType,
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/explore");
  return { success: true };
}

export async function getPioneerForEdit(id: number) {
  await requireAdmin();

  return db.pioneer.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      knownFor: true,
      intro: true,
      longBio: true,
      achievement: true,
      birthYear: true,
      deathYear: true,
      birthCity: true,
      birthCountry: true,
      nationality: true,
      century: true,
      contributionYear: true,
      era: true,
      gender: true,
      latitude: true,
      longitude: true,
      imageLocal: true,
      classifications: {
        select: { classification: { select: { name: true } } },
      },
      funFacts: { select: { fact: true }, orderBy: { order: "asc" } },
      awards: { select: { name: true, year: true } },
      institutions: { select: { name: true, role: true, years: true } },
      notableWorks: { select: { title: true, type: true, year: true } },
    },
  });
}

export async function updatePioneer(id: number, formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name"),
    imageLocal: formData.get("imageLocal") ?? undefined,
    knownFor: formData.get("knownFor") ?? undefined,
    intro: formData.get("intro"),
    longBio: formData.get("longBio") ?? undefined,
    achievement: formData.get("achievement"),
    birthYear: formData.get("birthYear") ?? undefined,
    deathYear: formData.get("deathYear") ?? undefined,
    birthCity: formData.get("birthCity") ?? undefined,
    birthCountry: formData.get("birthCountry"),
    nationality: formData.get("nationality") ?? undefined,
    century: formData.get("century"),
    contributionYear: formData.get("contributionYear"),
    era: formData.get("era"),
    gender: formData.get("gender"),
    latitude: formData.get("latitude") ?? undefined,
    longitude: formData.get("longitude") ?? undefined,
    classifications: formData
      .getAll("classifications")
      .filter(Boolean) as string[],
    funFacts: formData.getAll("funFacts").filter(Boolean) as string[],
    awards: JSON.parse((formData.get("awards") as string) ?? "[]") as {
      name: string;
      year?: number;
    }[],
    institutions: JSON.parse(
      (formData.get("institutions") as string) ?? "[]",
    ) as { name: string; role?: string; years?: string }[],
    notableWorks: JSON.parse(
      (formData.get("notableWorks") as string) ?? "[]",
    ) as { title: string; type?: string; year?: number }[],
  };

  const data = PioneerSchema.parse(raw);

  await db.$transaction(async (tx) => {
    await tx.pioneer.update({
      where: { id },
      data: {
        name: data.name,
        slug: slugify(data.name),
        imageLocal: data.imageLocal ?? null,
        knownFor: data.knownFor ?? null,
        intro: data.intro,
        longBio: data.longBio ?? null,
        achievement: data.achievement,
        birthYear: data.birthYear ?? null,
        deathYear: data.deathYear ?? null,
        birthCity: data.birthCity ?? null,
        birthCountry: data.birthCountry,
        nationality: data.nationality ?? null,
        century: data.century,
        contributionYear: data.contributionYear,
        era: data.era,
        gender: data.gender,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
      },
    });

    // Replace classifications
    await tx.pioneerClassification.deleteMany({ where: { pioneerId: id } });
    await Promise.all(
      data.classifications.map(async (name) => {
        const cls = await tx.classification.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        return tx.pioneerClassification.create({
          data: { pioneerId: id, classificationId: cls.id },
        });
      }),
    );

    // Replace one-to-many relations
    await tx.funFact.deleteMany({ where: { pioneerId: id } });
    await tx.funFact.createMany({
      data: data.funFacts.map((fact, order) => ({
        pioneerId: id,
        fact,
        order,
      })),
    });

    await tx.award.deleteMany({ where: { pioneerId: id } });
    await tx.award.createMany({
      data: data.awards.map((a) => ({ pioneerId: id, ...a })),
    });

    await tx.institution.deleteMany({ where: { pioneerId: id } });
    await tx.institution.createMany({
      data: data.institutions.map((i) => ({ pioneerId: id, ...i })),
    });

    await tx.notableWork.deleteMany({ where: { pioneerId: id } });
    await tx.notableWork.createMany({
      data: data.notableWorks.map((w) => ({
        pioneerId: id,
        title: w.title,
        type: (w.type ?? "Other") as WorkType,
        year: w.year,
      })),
    });
  });

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath(`/pioneer/${slugify(data.name)}`);
  return { success: true };
}

export async function deletePioneer(id: number) {
  await requireAdmin();
  await db.pioneer.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/explore");
  return { success: true };
}

export async function getAdminStats() {
  await requireAdmin();

  const [total, recentViews, topPioneers] = await Promise.all([
    db.pioneer.count(),
    db.pioneerView.count({
      where: {
        viewedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    db.pioneerView.groupBy({
      by: ["pioneerId"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ]);

  const topWithNames = await Promise.all(
    topPioneers.map(async (row) => {
      const pioneer = await db.pioneer.findUnique({
        where: { id: row.pioneerId },
        select: { name: true },
      });
      return { name: pioneer?.name ?? "Unknown", views: row._count.id };
    }),
  );

  return { total, recentViews, topPioneers: topWithNames };
}
