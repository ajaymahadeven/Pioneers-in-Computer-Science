import { ImageResponse } from "next/og";
import { db } from "@/server/db";
import { ERA_LABELS, ERA_COLORS } from "@/lib/utils";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PioneerOGImage({ params }: Props) {
  const { slug } = await params;

  const pioneer = await db.pioneer.findUnique({
    where: { slug },
    select: {
      name: true,
      knownFor: true,
      era: true,
      birthCountry: true,
      contributionYear: true,
      classifications: {
        take: 2,
        select: { classification: { select: { name: true } } },
      },
    },
  });

  const name = pioneer?.name ?? "Pioneer";
  const knownFor = pioneer?.knownFor ?? "";
  const eraLabel = pioneer ? (ERA_LABELS[pioneer.era] ?? pioneer.era) : "";
  const eraColor = pioneer ? (ERA_COLORS[pioneer.era] ?? "#888888") : "#888888";
  const field = pioneer?.classifications[0]?.classification.name ?? "";
  const meta = [pioneer?.birthCountry, pioneer?.contributionYear]
    .filter(Boolean)
    .join(" · ");

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0a0a0a",
        padding: "64px",
        fontFamily: "sans-serif",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          width: 48,
          height: 3,
          backgroundColor: eraColor,
          marginBottom: 32,
          borderRadius: 2,
        }}
      />

      {/* Era + field chips */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        <span
          style={{
            backgroundColor: eraColor + "22",
            border: `1px solid ${eraColor}55`,
            color: eraColor,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            padding: "4px 12px",
            borderRadius: 4,
          }}
        >
          {eraLabel}
        </span>
        {field && (
          <span
            style={{
              backgroundColor: "#ffffff10",
              border: "1px solid #ffffff20",
              color: "#888888",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "4px 12px",
              borderRadius: 4,
            }}
          >
            {field}
          </span>
        )}
      </div>

      {/* Name */}
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: "#f0ede8",
          letterSpacing: -1,
          lineHeight: 1.1,
          marginBottom: 20,
          maxWidth: 900,
        }}
      >
        {name}
      </div>

      {/* Known for */}
      {knownFor && (
        <div
          style={{
            fontSize: 22,
            color: "#8a8785",
            lineHeight: 1.4,
            maxWidth: 800,
            marginBottom: 24,
          }}
        >
          {knownFor}
        </div>
      )}

      {/* Meta */}
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        {meta && (
          <span
            style={{
              color: "#555",
              fontSize: 14,
              fontFamily: "monospace",
              letterSpacing: 1,
            }}
          >
            {meta}
          </span>
        )}
        <span
          style={{
            color: "#333",
            fontSize: 13,
            fontFamily: "monospace",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Pioneers in Computer Science
        </span>
      </div>
    </div>,
    { ...size },
  );
}
