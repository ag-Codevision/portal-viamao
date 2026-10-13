export interface ChannelLocation {
  stateCode: string | null;
  stateName: string | null;
  cityCode: string | null;
  cityName: string | null;
}
export interface CatalogChannel {
  id: string;
  name: string;
  country: string;
  countryName: string;
  gardenCountry: string | null;
  gardenId: string | null;
  iptvId: string | null;
  website: string | null;
  sources: { kind: "hls" | "youtube"; url: string; quality: string | null }[];
  geoBlocked: boolean;
  locations: ChannelLocation[];
  provenance: string[];
}
export interface TvSnapshot {
  schemaVersion: 1;
  importedAt: string;
  statistics: {
    channels: number;
    countries: number;
    brazil: number;
    tvGardenCountries: number;
    tvGardenExpected: number;
    withLocations: number;
  };
  failedCountries: { code: string; reason: string }[];
  countries: { code: string; name: string; count: number }[];
  channels: CatalogChannel[];
}
export interface TvFilters {
  country: string;
  state: string;
  city: string;
  query: string;
  page: number;
}
export interface WorldChannel extends Omit<CatalogChannel, "sources"> {
  sourceTypes: ("hls" | "youtube")[];
  sources?: { kind: "hls" | "youtube"; url: string; quality: string | null }[];
  playback: {
    kind: "hls" | "youtube" | "garden" | "external";
    url: string | null;
    provider: string;
    evidenceUrl: string | null;
  };
  watchUrl: string | null;
}
export interface TvCatalogResult {
  importedAt: string;
  statistics: TvSnapshot["statistics"];
  countries: TvSnapshot["countries"];
  states: { code: string; name: string }[];
  cities: { code: string; name: string }[];
  items: WorldChannel[];
  total: number;
  page: number;
  pages: number;
  pageSize: number;
  filters: TvFilters;
  partial: boolean;
}
