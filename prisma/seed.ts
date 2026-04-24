import { PrismaClient, Era, Gender, WorkType } from "../generated/prisma";
import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapEra(raw: string): Era {
  const map: Record<string, Era> = {
    "Ancient/Medieval Computing": Era.AncientMedieval,
    "Mechanical Computing": Era.Mechanical,
    "Early Electronic Computing": Era.EarlyElectronic,
    "Cold War Computing": Era.ColdWar,
    "Personal Computing Revolution": Era.PersonalComputing,
    "Internet Age": Era.InternetAge,
    "AI Era": Era.AIEra,
  };
  return map[raw] ?? Era.EarlyElectronic;
}

function mapGender(raw: string): Gender {
  if (raw === "female") return Gender.Female;
  if (raw === "male") return Gender.Male;
  return Gender.Unknown;
}

function mapWorkType(raw: string): WorkType {
  const map: Record<string, WorkType> = {
    paper: WorkType.Paper,
    book: WorkType.Book,
    system: WorkType.System,
    language: WorkType.Language,
    algorithm: WorkType.Algorithm,
    other: WorkType.Other,
  };
  return map[raw?.toLowerCase()] ?? WorkType.Other;
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function int(raw: string): number | null {
  const n = parseInt(raw, 10);
  return isNaN(n) ? null : n;
}

function float(raw: string): number | null {
  const n = parseFloat(raw);
  return isNaN(n) ? null : n;
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function main() {
  const csvPath = join(__dirname, "../local_db_storage/pioneers_enriched.csv");
  const content = readFileSync(csvPath, "utf-8");
  const rows = parse(content, {
    columns: true,
    skip_empty_lines: true,
  }) as Record<string, string>[];

  console.log(`Seeding ${rows.length} pioneers...`);

  // Collect all unique classification tags first
  const allTags = new Set<string>();
  for (const row of rows) {
    const tags = parseJson<string[]>(row.classification, []);
    tags.forEach((t) => allTags.add(t));
  }

  // Upsert classifications
  await Promise.all(
    [...allTags].map((name) =>
      prisma.classification.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const classificationMap = new Map(
    (await prisma.classification.findMany()).map((c) => [c.name, c.id]),
  );

  // Seed pioneers
  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const existing = await prisma.pioneer.findUnique({
      where: { name: row.name },
    });
    if (existing) {
      skipped++;
      continue;
    }

    const tags = parseJson<string[]>(row.classification, []);
    const education = parseJson<
      {
        degree: string | null;
        field: string | null;
        institution: string;
        year: number | null;
      }[]
    >(row.education, []);
    const awards = parseJson<{ name: string; year: number | null }[]>(
      row.awards,
      [],
    );
    const institutions = parseJson<
      { name: string; role: string | null; years: string | null }[]
    >(row.institutions, []);
    const notableWorks = parseJson<
      { title: string; type: string; year: number | null }[]
    >(row.notableWorks, []);
    const funFacts = parseJson<string[]>(row.funFacts, []);
    const influencedBy = parseJson<string[]>(row.influencedBy, []);
    const influenced = parseJson<string[]>(row.influenced, []);

    await prisma.pioneer.create({
      data: {
        name: row.name,
        knownFor: row.knownFor || null,
        intro: row.intro,
        longBio: row.longBio || null,
        achievement: row.achievement,
        birthYear: int(row.birthYear),
        deathYear: int(row.deathYear),
        birthCity: row.birthCity || null,
        birthCountry: row.birthCountry,
        nationality: row.nationality || null,
        century: int(row.century) ?? 20,
        contributionYear: int(row.contributionYear) ?? 1900,
        era: mapEra(row.era),
        gender: mapGender(row.gender),
        latitude: float(row.latitude),
        longitude: float(row.longitude),
        imageLocal: row.imageLocal || null,

        classifications: {
          create: tags
            .filter((t) => classificationMap.has(t))
            .map((t) => ({ classificationId: classificationMap.get(t)! })),
        },

        education: {
          create: education.map((e) => ({
            institution: e.institution,
            degree: e.degree ?? null,
            field: e.field ?? null,
            year: e.year ?? null,
          })),
        },

        awards: {
          create: awards.map((a) => ({
            name: a.name,
            year: a.year ?? null,
          })),
        },

        institutions: {
          create: institutions.map((inst) => ({
            name: inst.name,
            role: inst.role ?? null,
            years: inst.years ?? null,
          })),
        },

        notableWorks: {
          create: notableWorks.map((w) => ({
            title: w.title,
            type: mapWorkType(w.type),
            year: w.year ?? null,
          })),
        },

        funFacts: {
          create: funFacts.map((fact, idx) => ({
            fact,
            order: idx,
          })),
        },

        influences: {
          create: [
            ...influencedBy.map((name) => ({
              direction: "influencedBy",
              name,
            })),
            ...influenced.map((name) => ({ direction: "influenced", name })),
          ],
        },
      },
    });

    created++;
    if (created % 20 === 0)
      console.log(`  ${created}/${rows.length - skipped} done...`);
  }

  console.log(
    `\nDone. Created: ${created}  Skipped (already exists): ${skipped}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
