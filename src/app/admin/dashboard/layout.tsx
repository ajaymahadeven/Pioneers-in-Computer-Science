import { type ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSession,
} from "@/app/_lib/admin-session";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) redirect("/admin");

  const session = await verifyAdminSession(token);
  if (!session) redirect("/admin?error=session_expired");

  return (
    <AdminShell
      githubLogin={session.githubLogin}
      githubAvatar={session.githubAvatar}
    >
      {children}
    </AdminShell>
  );
}
