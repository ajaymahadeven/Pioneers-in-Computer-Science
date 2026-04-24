"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { slugify, ERA_COLORS, ERA_LABELS } from "@/lib/utils";
import type { MapPoint } from "@/types/pioneer";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const LIGHT = {
  ocean: "#e8e6e1",
  land: "#d4d1cb",
  landHover: "#c4c1bb",
  border: "#b8b5af",
  containerBg: "#f0ede8",
  containerBorder: "#dddbd5",
  legendText: "#5c5a56",
  legendBorder: "#dddbd5",
  tooltipBg: "#1a1a1a",
  tooltipText: "#f0ede8",
  markerStroke: "#1a1a1a",
};

const DARK = {
  ocean: "#141414",
  land: "#2c2c2c",
  landHover: "#383838",
  border: "#444444",
  containerBg: "#1a1a1a",
  containerBorder: "#2c2c2c",
  legendText: "#8a8785",
  legendBorder: "#2c2c2c",
  tooltipBg: "#2c2c2c",
  tooltipText: "#f0ede8",
  markerStroke: "#ffffff",
};

export function WorldMap({ points }: { points: MapPoint[] }) {
  const [hovered, setHovered] = useState<MapPoint | null>(null);
  const [activeEras, setActiveEras] = useState<Set<string>>(
    new Set(Object.keys(ERA_COLORS)),
  );
  const { resolvedTheme } = useTheme();

  const theme = resolvedTheme === "dark" ? DARK : LIGHT;

  const validPoints = points.filter(
    (p) => p.latitude !== null && p.longitude !== null && activeEras.has(p.era),
  );

  function toggleEra(era: string) {
    setActiveEras((prev) => {
      const next = new Set(prev);
      if (next.has(era)) {
        next.delete(era);
      } else {
        next.add(era);
      }
      return next;
    });
  }

  return (
    <section className="bg-white py-20 dark:bg-[#1e1e1e]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold tracking-widest text-[#5c5a56] uppercase dark:text-[#8a8785]">
            Global Impact
          </p>
          <h2 className="text-3xl font-bold text-[#1a1a1a] dark:text-[#f0ede8]">
            Pioneers across the globe
          </h2>
          <p className="mt-2 text-sm text-[#5c5a56] dark:text-[#8a8785]">
            {validPoints.length} pioneers shown · click an era to toggle
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: theme.containerBg,
            borderColor: theme.containerBorder,
          }}
        >
          <ComposableMap
            projection="geoNaturalEarth1"
            projectionConfig={{ scale: 205, center: [0, 15] }}
            style={{
              width: "100%",
              height: "auto",
              backgroundColor: theme.ocean,
            }}
          >
            <ZoomableGroup zoom={1}>
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: { rsmKey: string }[] }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={
                        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
                        geo as any
                      }
                      style={{
                        default: {
                          fill: theme.land,
                          stroke: theme.border,
                          strokeWidth: 0.4,
                          outline: "none",
                        },
                        hover: {
                          fill: theme.landHover,
                          stroke: theme.border,
                          strokeWidth: 0.4,
                          outline: "none",
                        },
                        pressed: {
                          fill: theme.land,
                          stroke: theme.border,
                          strokeWidth: 0.4,
                          outline: "none",
                        },
                      }}
                    />
                  ))
                }
              </Geographies>

              {validPoints.map((p) => {
                const color = ERA_COLORS[p.era] ?? "#888888";
                const isHovered = hovered?.id === p.id;
                return (
                  <Marker
                    key={p.id}
                    coordinates={[p.longitude!, p.latitude!]}
                    onMouseEnter={() => setHovered(p)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <circle
                      r={isHovered ? 4 : 2.5}
                      fill={color}
                      fillOpacity={isHovered ? 1 : 0.85}
                      stroke={isHovered ? theme.markerStroke : "transparent"}
                      strokeWidth={isHovered ? 1 : 0}
                      style={{
                        cursor: "pointer",
                        transition: "r 0.15s, fill-opacity 0.15s",
                      }}
                    />
                    {isHovered && (
                      <foreignObject
                        x={6}
                        y={-18}
                        width={180}
                        height={36}
                        style={{ overflow: "visible" }}
                      >
                        <div
                          className="rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl"
                          style={{
                            backgroundColor: theme.tooltipBg,
                            border: "1px solid rgba(128,128,128,0.2)",
                          }}
                        >
                          <Link
                            href={`/pioneer/${slugify(p.name)}`}
                            className="text-[11px] font-medium hover:underline"
                            style={{ color: theme.tooltipText }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {p.name}
                          </Link>
                        </div>
                      </foreignObject>
                    )}
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Interactive era legend */}
          <div
            className="flex flex-wrap gap-x-3 gap-y-2 border-t px-6 py-4"
            style={{ borderColor: theme.legendBorder }}
          >
            {Object.entries(ERA_COLORS).map(([era, color]) => {
              const isActive = activeEras.has(era);
              return (
                <button
                  key={era}
                  onClick={() => toggleEra(era)}
                  className="flex items-center gap-1.5 rounded px-2 py-1 transition-opacity"
                  style={{
                    opacity: isActive ? 1 : 0.35,
                    border: `1px solid ${isActive ? color + "40" : "transparent"}`,
                    backgroundColor: isActive ? color + "14" : "transparent",
                  }}
                  title={
                    isActive
                      ? `Hide ${ERA_LABELS[era] ?? era}`
                      : `Show ${ERA_LABELS[era] ?? era}`
                  }
                >
                  <span
                    className="h-2 w-2 rounded-full transition-transform"
                    style={{
                      backgroundColor: color,
                      transform: isActive ? "scale(1)" : "scale(0.6)",
                    }}
                  />
                  <span
                    className="text-[11px] font-medium"
                    style={{
                      color: isActive ? color : theme.legendText,
                      textDecoration: isActive ? "none" : "line-through",
                    }}
                  >
                    {ERA_LABELS[era] ?? era}
                  </span>
                </button>
              );
            })}

            {/* Select all / clear shortcuts */}
            <div
              className="ml-auto flex items-center gap-1"
              style={{
                borderLeft: `1px solid ${theme.legendBorder}`,
                paddingLeft: "0.75rem",
              }}
            >
              <button
                onClick={() => setActiveEras(new Set(Object.keys(ERA_COLORS)))}
                className="text-[10px] font-medium tracking-widest uppercase transition-opacity hover:opacity-100"
                style={{ color: theme.legendText, opacity: 0.6 }}
              >
                All
              </button>
              <span style={{ color: theme.legendBorder }}>·</span>
              <button
                onClick={() => setActiveEras(new Set())}
                className="text-[10px] font-medium tracking-widest uppercase transition-opacity hover:opacity-100"
                style={{ color: theme.legendText, opacity: 0.6 }}
              >
                None
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
