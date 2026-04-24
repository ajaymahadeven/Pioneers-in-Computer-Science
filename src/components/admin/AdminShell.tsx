"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  Activity,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/dashboard/pioneers", label: "Pioneers", icon: Users },
  {
    href: "/admin/dashboard/pioneers/new",
    label: "Add Pioneer",
    icon: PlusCircle,
  },
  { href: "/admin/dashboard/activity", label: "Activity", icon: Activity },
];

interface Props {
  children: ReactNode;
  githubLogin: string;
  githubAvatar: string;
}

export function AdminShell({ children, githubLogin, githubAvatar }: Props) {
  const pathname = usePathname();

  return (
    <div className="bg-background flex min-h-screen">
      {/* Sidebar */}
      <aside className="border-border bg-card flex w-56 flex-none flex-col border-r">
        <div className="border-border flex h-14 items-center gap-2.5 border-b px-4">
          <div className="border-border bg-muted flex h-7 w-7 items-center justify-center rounded border">
            <span className="text-foreground font-mono text-[10px] font-bold">
              P
            </span>
          </div>
          <span className="text-foreground text-sm font-semibold tracking-tight">
            Admin
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/admin/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="border-border border-t p-3">
          <div className="mb-2 flex items-center gap-2.5">
            {githubAvatar && (
              <Image
                src={githubAvatar}
                alt={githubLogin}
                width={28}
                height={28}
                className="border-border rounded-full border"
              />
            )}
            <span className="text-foreground truncate text-xs font-medium">
              {githubLogin}
            </span>
          </div>
          <form action="/api/auth/admin/logout" method="POST">
            <button
              type="submit"
              className="text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs transition-colors"
            >
              <LogOut className="h-3 w-3" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
