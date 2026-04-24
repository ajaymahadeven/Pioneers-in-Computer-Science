import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as { pioneerId?: number };
    if (!body.pioneerId || typeof body.pioneerId !== "number") {
      return NextResponse.json({ error: "Invalid" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    let ipHash: string | null = null;
    if (ip) {
      const buf = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(ip),
      );
      ipHash = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }

    await db.pioneerView.create({
      data: { pioneerId: body.pioneerId, ipHash },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
