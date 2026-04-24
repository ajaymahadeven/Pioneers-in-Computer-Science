import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET(): NextResponse {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "GitHub OAuth not configured" },
      { status: 500 },
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${appUrl}/api/auth/admin/github/callback`,
    scope: "read:user",
    state: crypto.randomUUID(),
  });

  return NextResponse.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`,
  );
}
