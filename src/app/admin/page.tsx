import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSession,
} from "@/app/_lib/admin-session";
import { AdminLogin } from "@/app/admin/_components/AdminLogin";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminPage({ searchParams }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (token) {
    const session = await verifyAdminSession(token);
    if (session) redirect("/admin/dashboard");
  }

  const { error } = await searchParams;
  return <AdminLogin error={error} />;
}
