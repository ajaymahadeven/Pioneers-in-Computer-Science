import { Suspense } from "react";
import { api } from "@/trpc/server";
import { HeroSection } from "@/components/hero-section/HeroSection";
import { HeroSectionSkeleton } from "@/components/hero-section/HeroSectionSkeleton";
import { StatsStrip } from "@/components/stats-strip/StatsStrip";
import { EraStrip } from "@/components/era-strip/EraStrip";
import { EraStripSkeleton } from "@/components/era-strip/EraStripSkeleton";
import { FeaturedPioneers } from "@/components/featured-pioneers/FeaturedPioneers";
import { FeaturedPioneersSkeleton } from "@/components/featured-pioneers/FeaturedPioneersSkeleton";
import { FieldsCloud } from "@/components/fields-cloud/FieldsCloud";
import { FunFactSpotlight } from "@/components/fun-fact-spotlight/FunFactSpotlight";
import { FunFactSpotlightSkeleton } from "@/components/fun-fact-spotlight/FunFactSpotlightSkeleton";
import { WorldMap } from "@/components/world-map/WorldMap";
import { WorldMapSkeleton } from "@/components/world-map/WorldMapSkeleton";
import { SiteFooter } from "@/components/site-footer/SiteFooter";

async function HeroData() {
  const [featured, stats] = await Promise.all([
    api.pioneer.getFeatured(),
    api.pioneer.getStats(),
  ]);
  return (
    <HeroSection
      mosaicPioneers={featured.slice(0, 7)}
      totalPioneers={stats.totalPioneers}
      totalFields={stats.totalFields}
    />
  );
}

async function StatsData() {
  const stats = await api.pioneer.getStats();
  return (
    <StatsStrip
      totalPioneers={stats.totalPioneers}
      totalCountries={stats.totalCountries}
      totalEras={stats.totalEras}
      totalFields={stats.totalFields}
    />
  );
}

async function EraData() {
  const [stats, eraReps] = await Promise.all([
    api.pioneer.getStats(),
    api.pioneer.getEraRepresentatives(),
  ]);
  const eraCards = stats.eras.map((statsEra) => {
    const rep = eraReps.find((e) => e.era === statsEra.era);
    return { ...statsEra, pioneer: rep?.pioneer ?? null };
  });
  return <EraStrip eras={eraCards} />;
}

async function FeaturedData() {
  const [featured, stats] = await Promise.all([
    api.pioneer.getFeatured(),
    api.pioneer.getStats(),
  ]);
  return (
    <FeaturedPioneers pioneers={featured} totalPioneers={stats.totalPioneers} />
  );
}

async function FieldsData() {
  const stats = await api.pioneer.getStats();
  return <FieldsCloud classifications={stats.classifications} />;
}

async function FunFactData() {
  const pioneer = await api.pioneer.getFunFact();
  if (!pioneer) return null;
  return <FunFactSpotlight pioneer={pioneer} />;
}

async function MapData() {
  const mapPoints = await api.pioneer.getMapPoints();
  return <WorldMap points={mapPoints} />;
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<HeroSectionSkeleton />}>
        <HeroData />
      </Suspense>

      <Suspense
        fallback={<div className="h-20 bg-[#f7f6f2] dark:bg-[#1e1e1e]" />}
      >
        <StatsData />
      </Suspense>

      <Suspense fallback={<EraStripSkeleton />}>
        <EraData />
      </Suspense>

      <Suspense fallback={<FeaturedPioneersSkeleton />}>
        <FeaturedData />
      </Suspense>

      <Suspense
        fallback={<div className="h-40 bg-[#f7f6f2] dark:bg-[#141414]" />}
      >
        <FieldsData />
      </Suspense>

      <Suspense fallback={<FunFactSpotlightSkeleton />}>
        <FunFactData />
      </Suspense>

      <Suspense fallback={<WorldMapSkeleton />}>
        <MapData />
      </Suspense>

      <SiteFooter />
    </main>
  );
}
