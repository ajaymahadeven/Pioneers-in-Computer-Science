"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { blobToProxyUrl, ERA_COLORS, ERA_LABELS } from "@/lib/utils";

interface Result {
  id: number;
  name: string;
  slug: string;
  knownFor: string | null;
  era: string;
  imageLocal: string | null;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function SearchPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const debouncedQuery = useDebounce(query, 180);

  // Fetch results whenever debounced query changes or palette opens
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data: Result[]) => {
        setResults(data);
        setActive(0);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery, open]);

  // Focus input when opened, reset state when closed
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
      setActive(0);
    }
  }, [open]);

  const navigate = useCallback(
    (slug: string) => {
      onClose();
      router.push(`/pioneer/${slug}`);
    },
    [onClose, router],
  );

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const r = results[active];
      if (r) navigate(r.slug);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
        aria-hidden
      />

      {/* Palette */}
      <div className="fixed top-[15vh] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
        <div className="border-border bg-solid overflow-hidden rounded-xl border shadow-2xl">
          {/* Input row */}
          <div className="border-border flex items-center gap-3 border-b px-4 py-3">
            <Search className="text-muted-foreground h-4 w-4 flex-none" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Search pioneers, fields, countries…"
              className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear">
                <X className="text-muted-foreground hover:text-foreground h-3.5 w-3.5 transition-colors" />
              </button>
            )}
            <kbd className="border-border text-muted-foreground bg-muted hidden rounded border px-1.5 py-0.5 font-mono text-[10px] sm:block">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <p className="text-muted-foreground px-4 py-8 text-center text-xs">
                Searching…
              </p>
            )}

            {!loading && results.length === 0 && query.length > 0 && (
              <p className="text-muted-foreground px-4 py-8 text-center text-xs">
                No pioneers found for &ldquo;{query}&rdquo;
              </p>
            )}

            {!loading && results.length > 0 && (
              <ul>
                {!query && (
                  <li className="text-muted-foreground px-4 pt-3 pb-1 text-[10px] font-medium tracking-widest uppercase">
                    Suggested
                  </li>
                )}
                {results.map((r, i) => {
                  const eraColor = ERA_COLORS[r.era] ?? "#888888";
                  const eraLabel = ERA_LABELS[r.era] ?? r.era;
                  const imgSrc = blobToProxyUrl(r.imageLocal);
                  const isActive = i === active;

                  return (
                    <li key={r.id}>
                      <button
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          isActive ? "bg-accent" : "hover:bg-accent"
                        }`}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => navigate(r.slug)}
                      >
                        {/* Avatar */}
                        <div
                          className="flex h-8 w-8 flex-none items-center justify-center overflow-hidden rounded"
                          style={{ backgroundColor: eraColor + "22" }}
                        >
                          {imgSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imgSrc}
                              alt={r.name}
                              className="h-full w-full object-cover object-top"
                            />
                          ) : (
                            <span
                              className="text-[11px] font-bold"
                              style={{ color: eraColor }}
                            >
                              {r.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-sm font-medium">
                            {r.name}
                          </p>
                          {r.knownFor && (
                            <p className="text-muted-foreground truncate text-xs">
                              {r.knownFor}
                            </p>
                          )}
                        </div>

                        {/* Era chip */}
                        <span
                          className="hidden flex-none rounded px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-white uppercase sm:block"
                          style={{ backgroundColor: eraColor }}
                        >
                          {eraLabel}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer hint */}
          <div className="border-border text-muted-foreground flex items-center gap-3 border-t px-4 py-2 font-mono text-[10px]">
            <span>
              <kbd className="border-border bg-muted rounded border px-1 py-0.5">
                ↑
              </kbd>{" "}
              <kbd className="border-border bg-muted rounded border px-1 py-0.5">
                ↓
              </kbd>{" "}
              navigate
            </span>
            <span>
              <kbd className="border-border bg-muted rounded border px-1 py-0.5">
                ↵
              </kbd>{" "}
              open
            </span>
            <span>
              <kbd className="border-border bg-muted rounded border px-1 py-0.5">
                esc
              </kbd>{" "}
              close
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
