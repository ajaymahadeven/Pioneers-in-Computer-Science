import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/app/_lib/admin-session";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(): Promise<NextResponse> {
  (await cookies()).delete(ADMIN_COOKIE_NAME);
  return NextResponse.redirect(`${APP_URL}/admin`);
}
