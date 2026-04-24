import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 h-14 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo box + wordmark */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="border-border bg-muted flex h-7 w-7 items-center justify-center rounded border">
            <Image
              src="/logo.svg"
              alt="Pioneers in Computer Science"
              width={20}
              height={20}
              className="invert dark:invert-0"
            />
          </div>
          <span className="text-foreground text-sm font-semibold tracking-tight">
            Pioneers in CS
          </span>
        </Link>

        {/* Nav + toggle */}
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-1 sm:flex">
            {[
              { href: "/explore", label: "Explore" },
              { href: "/timeline", label: "Timeline" },
              { href: "/random", label: "Random" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-3 py-1.5 text-sm transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
