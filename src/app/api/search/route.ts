import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    // Empty query — return 4 random pioneers as suggestions
    const count = await db.pioneer.count();
    const skip = Math.max(0, Math.floor(Math.random() * (count - 4)));
    const pioneers = await db.pioneer.findMany({
      skip,
      take: 4,
      select: {
        id: true,
        name: true,
        slug: true,
        knownFor: true,
        era: true,
        imageLocal: true,
      },
    });
    return NextResponse.json(pioneers);
  }

  const pioneers = await db.pioneer.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { knownFor: { contains: q, mode: "insensitive" } },
        { birthCountry: { contains: q, mode: "insensitive" } },
        {
          classifications: {
            some: {
              classification: {
                name: { contains: q, mode: "insensitive" },
              },
            },
          },
        },
      ],
    },
    take: 8,
    orderBy: { contributionYear: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      knownFor: true,
      era: true,
      imageLocal: true,
    },
  });

  return NextResponse.json(pioneers);
}
