import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSession,
  getAdminCookieOptions,
  getSessionExpiry,
} from "@/app/_lib/admin-session";

export const runtime = "nodejs";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${APP_URL}/admin?error=no_code`);
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${APP_URL}/api/auth/admin/github/callback`,
      }),
    },
  );

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
  };

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${APP_URL}/admin?error=token_exchange`);
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const githubUser = (await userResponse.json()) as {
    id?: number;
    login?: string;
    avatar_url?: string;
  };

  if (!githubUser.id) {
    return NextResponse.redirect(`${APP_URL}/admin?error=user_fetch`);
  }

  const allowedId = process.env.ADMIN_GITHUB_USER_ID;
  if (String(githubUser.id) !== String(allowedId)) {
    return NextResponse.redirect(`${APP_URL}/admin?error=denied`);
  }

  const token = await createAdminSession({
    githubId: String(githubUser.id),
    githubLogin: githubUser.login ?? "",
    githubAvatar: githubUser.avatar_url ?? "",
  });

  const expires = getSessionExpiry();
  (await cookies()).set(
    ADMIN_COOKIE_NAME,
    token,
    getAdminCookieOptions(expires),
  );

  return NextResponse.redirect(`${APP_URL}/admin/dashboard`);
}
