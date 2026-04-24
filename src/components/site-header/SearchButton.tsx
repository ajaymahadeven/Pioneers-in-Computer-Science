"use client";

import { Search } from "lucide-react";
import { useSearch } from "@/components/search-palette/SearchProvider";

export function SearchButton() {
  const { open } = useSearch();

  return (
    <button
      onClick={open}
      className="border-border bg-muted text-muted-foreground hover:bg-accent hover:text-foreground flex items-center gap-2 rounded border px-2.5 py-1.5 text-xs transition-colors"
      aria-label="Search pioneers"
    >
      <Search className="h-3.5 w-3.5" />
      <span className="hidden sm:block">Search</span>
      <kbd className="border-border bg-background hidden rounded border px-1 py-0.5 font-mono text-[10px] sm:block">
        ⌘K
      </kbd>
    </button>
  );
}
