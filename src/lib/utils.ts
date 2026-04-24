import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Apple HIG semantic system colors — each era maps to a distinct, accessible hue
export const ERA_COLORS: Record<string, string> = {
  AncientMedieval: "#8e44ad", // Purple  — antiquity, mystery
  Mechanical: "#c0392b", // Red     — industrial machinery
  EarlyElectronic: "#d35400", // Orange  — vacuum tubes, warm glow
  ColdWar: "#27ae60", // Green   — radar, terminal phosphor
  PersonalComputing: "#2980b9", // Blue    — home desktop era
  InternetAge: "#16a085", // Teal    — networked world
  AIEra: "#f39c12", // Amber   — neural networks, intelligence
};

const AZURE_BASE =
  "https://pioneersincs.blob.core.windows.net/pioneers-images/";

export function blobToProxyUrl(imageLocal: string | null): string | null {
  if (!imageLocal) return null;
  if (imageLocal.startsWith(AZURE_BASE)) {
    const filename = imageLocal.slice(AZURE_BASE.length);
    return `/api/images/${filename}`;
  }
  return imageLocal;
}

export const ERA_LABELS: Record<string, string> = {
  AncientMedieval: "Ancient & Medieval",
  Mechanical: "Mechanical",
  EarlyElectronic: "Early Electronic",
  ColdWar: "Cold War",
  PersonalComputing: "Personal Computing",
  InternetAge: "Internet Age",
  AIEra: "AI Era",
};
