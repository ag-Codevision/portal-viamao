import { z } from "zod";
import { normalize } from "@/lib/utils";
import type { TvSnapshot, TvFilters, TvCatalogResult } from "@/types/world-tv";
import { presentChannel } from "./world-tv-policy";
export const tvFilterSchema = z.object({
  country: z
    .string()
    .regex(/^(?:[A-Z]{2})?$/)
    .default("BR"),
  state: z
    .string()
    .max(30)
    .regex(/^(?:[A-Z0-9-]+|__unknown__)?$/)
    .default(""),
  city: z
    .string()
    .max(30)
    .regex(/^(?:[A-Z0-9-]+|__unknown__)?$/)
    .default(""),
  query: z.string().trim().max(100).default(""),
  page: z.coerce.number().int().min(1).max(10000).default(1),
});
export function queryCatalog(
  snapshot: TvSnapshot,
  filters: TvFilters,
): TvCatalogResult {
  const countryItems = snapshot.channels.filter(
    (channel) => !filters.country || channel.country === filters.country,
  );
  const states = new Map<string, string>(),
    cities = new Map<string, string>();
  for (const channel of countryItems)
    for (const location of channel.locations) {
      if (location.stateCode && location.stateName)
        states.set(location.stateCode, location.stateName);
      if (
        location.cityCode &&
        location.cityName &&
        (!filters.state || location.stateCode === filters.state)
      )
        cities.set(location.cityCode, location.cityName);
    }
  const items = countryItems.filter((channel) => {
    if (
      filters.state === "__unknown__" &&
      channel.locations.some((location) => location.stateCode)
    )
      return false;
    if (
      filters.state &&
      filters.state !== "__unknown__" &&
      !channel.locations.some(
        (location) => location.stateCode === filters.state,
      )
    )
      return false;
    if (
      filters.city === "__unknown__" &&
      channel.locations.some(
        (location) =>
          location.cityCode &&
          (!filters.state || location.stateCode === filters.state),
      )
    )
      return false;
    if (
      filters.city &&
      filters.city !== "__unknown__" &&
      !channel.locations.some(
        (location) =>
          location.cityCode === filters.city &&
          (!filters.state || location.stateCode === filters.state),
      )
    )
      return false;
    return (
      !filters.query ||
      normalize(
        `${channel.name} ${channel.countryName} ${channel.locations.map((location) => `${location.stateName ?? ""} ${location.cityName ?? ""}`).join(" ")}`,
      ).includes(normalize(filters.query))
    );
  });
  // Nunca enviar milhares de registros ou URLs não verificadas ao navegador.
  const pageSize = 25,
    pages = Math.max(1, Math.ceil(items.length / pageSize)),
    page = Math.min(filters.page, pages);
  const sort = (map: Map<string, string>) =>
    [...map]
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  return {
    importedAt: snapshot.importedAt,
    statistics: snapshot.statistics,
    countries: snapshot.countries,
    states: filters.country ? sort(states) : [],
    cities: filters.country ? sort(cities) : [],
    items: items
      .slice((page - 1) * pageSize, page * pageSize)
      .map(presentChannel),
    total: items.length,
    page,
    pages,
    pageSize,
    filters: { ...filters, page },
    partial: snapshot.failedCountries.length > 0,
  };
}
