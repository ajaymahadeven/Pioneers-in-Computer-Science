"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { ERA_LABELS } from "@/lib/utils";

interface Props {
  currentQ: string;
  currentEra: string;
  currentField: string;
  currentCountry: string;
  countries: string[];
  fields: string[];
}

export function ExploreFilters({
  currentQ,
  currentEra,
  currentField,
  currentCountry,
  countries,
  fields,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams();
      const merged = {
        q: currentQ,
        era: currentEra,
        field: currentField,
        country: currentCountry,
        ...updates,
      };
      if (merged.q) params.set("q", merged.q);
      if (merged.era) params.set("era", merged.era);
      if (merged.field) params.set("field", merged.field);
      if (merged.country) params.set("country", merged.country);
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [currentQ, currentEra, currentField, currentCountry, pathname, router],
  );

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Search */}
      <input
        type="search"
        placeholder="Search name, field, country…"
        defaultValue={currentQ}
        onChange={(e) => navigate({ q: e.target.value, page: "1" })}
        className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-ring h-9 w-full rounded border px-3 font-mono text-sm focus:ring-1 focus:outline-none sm:w-64"
      />

      {/* Era */}
      <select
        value={currentEra}
        onChange={(e) => navigate({ era: e.target.value, page: "1" })}
        className="border-border bg-card text-foreground focus:ring-ring h-9 rounded border px-2 font-mono text-sm focus:ring-1 focus:outline-none sm:w-44"
      >
        <option value="">All eras</option>
        {Object.entries(ERA_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* Field */}
      <select
        value={currentField}
        onChange={(e) => navigate({ field: e.target.value, page: "1" })}
        className="border-border bg-card text-foreground focus:ring-ring h-9 rounded border px-2 font-mono text-sm focus:ring-1 focus:outline-none sm:w-52"
      >
        <option value="">All fields</option>
        {fields.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      {/* Country */}
      <select
        value={currentCountry}
        onChange={(e) => navigate({ country: e.target.value, page: "1" })}
        className="border-border bg-card text-foreground focus:ring-ring h-9 rounded border px-2 font-mono text-sm focus:ring-1 focus:outline-none sm:w-48"
      >
        <option value="">All countries</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
