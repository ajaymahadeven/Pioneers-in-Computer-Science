import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="dot-grid-light dark:dot-grid flex min-h-[80vh] items-center justify-center bg-white dark:bg-black">
      <div className="mx-auto max-w-md px-6 text-center">
        <p className="text-muted-foreground mb-4 font-mono text-xs font-medium tracking-widest uppercase">
          404
        </p>
        <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          This pioneer hasn&apos;t been catalogued yet — or the URL is wrong.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="border-border bg-muted text-foreground hover:bg-accent inline-flex items-center gap-2 rounded border px-4 py-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <Link
            href="/explore"
            className="border-border bg-foreground text-background inline-flex items-center gap-2 rounded border px-4 py-2 text-sm font-medium transition-colors hover:opacity-85"
          >
            <Search className="h-3.5 w-3.5" />
            Explore pioneers
          </Link>
        </div>
      </div>
    </div>
  );
}
