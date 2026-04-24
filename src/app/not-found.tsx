import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="dot-grid-light dark:dot-grid flex min-h-[80vh] items-center justify-center bg-white dark:bg-black">
      <div className="mx-auto max-w-md px-6 text-center">
        <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          404
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          This pioneer hasn&apos;t been catalogued yet — or the URL is wrong.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded border border-border bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-85"
          >
            <Search className="h-3.5 w-3.5" />
            Explore pioneers
          </Link>
        </div>
      </div>
    </div>
  );
}
