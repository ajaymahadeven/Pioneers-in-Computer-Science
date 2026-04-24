export interface HeroPioneer {
  id: number;
  name: string;
  imageLocal: string | null;
}

export interface PioneerCardProps {
  id: number;
  name: string;
  knownFor: string | null;
  imageLocal: string | null;
  era: string;
  birthCountry: string;
  classifications: { classification: { name: string } }[];
}

export interface EraMeta {
  era: string;
  count: number;
  label?: string;
  range?: string;
  color?: string;
  pioneer: {
    id: number;
    name: string;
    imageLocal: string | null;
    era: string;
  } | null;
}

export interface StatsProps {
  totalPioneers: number;
  totalCountries: number;
  totalEras: number;
  totalFields: number;
}

export interface Classification {
  name: string;
  count: number;
}

export interface FunFact {
  id: number;
  fact: string;
}

export interface FunFactPioneer {
  id: number;
  name: string;
  imageLocal: string | null;
  funFacts: FunFact[];
}

export interface MapPoint {
  id: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
  era: string;
}

export interface FeaturedPioneer {
  id: number;
  name: string;
  knownFor: string | null;
  imageLocal: string | null;
  era: string;
  birthCountry: string;
  classifications: { classification: { name: string } }[];
}
