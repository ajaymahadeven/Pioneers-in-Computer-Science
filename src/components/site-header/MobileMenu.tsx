"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/timeline", label: "Timeline" },
  { href: "/random", label: "Random" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="border-border bg-muted text-foreground hover:bg-accent flex h-8 w-8 items-center justify-center rounded border transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div className="border-border bg-solid absolute top-14 right-0 left-0 z-50 border-b">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm transition-colors ${
                  pathname === href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
