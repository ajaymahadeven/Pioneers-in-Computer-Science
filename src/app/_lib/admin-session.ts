import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "PICS-ADMIN-SESSION";

const SESSION_DURATION_MS = 60 * 60 * 8 * 1000; // 8 hours

function getAdminSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET is not defined");
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  githubId: string;
  githubLogin: string;
  githubAvatar: string;
}

export async function createAdminSession(
  payload: AdminSessionPayload,
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getAdminSecret());
}

export async function verifyAdminSession(
  token: string,
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAdminSecret(), {
      algorithms: ["HS256"],
    });
    return payload as unknown as AdminSessionPayload;
  } catch {
    return null;
  }
}

export function getAdminCookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    expires,
  };
}

export function getSessionExpiry(): Date {
  return new Date(Date.now() + SESSION_DURATION_MS);
}
