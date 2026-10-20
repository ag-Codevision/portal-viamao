"use client";

import { useCity } from "@/lib/context/city-context";

export interface CityTextProps {
  prefix?: string;
  suffix?: string;
  defaultCity?: string;
  fallback?: string;
}

export function CityText({
  prefix = "",
  suffix = "",
  defaultCity = "Viamão",
  fallback,
}: CityTextProps) {
  const { city } = useCity();
  const name = city?.shortName || fallback || defaultCity;

  return (
    <>
      {prefix}
      {name}
      {suffix}
    </>
  );
}
