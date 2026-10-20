"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface MetroCity {
  slug: string;
  name: string;
  shortName: string;
}

export const METRO_CITIES: MetroCity[] = [
  { slug: "viamao", name: "Viamão, RS", shortName: "Viamão" },
  { slug: "porto-alegre", name: "Porto Alegre, RS", shortName: "Porto Alegre" },
  { slug: "alvorada", name: "Alvorada, RS", shortName: "Alvorada" },
  { slug: "cachoeirinha", name: "Cachoeirinha, RS", shortName: "Cachoeirinha" },
  { slug: "canoas", name: "Canoas, RS", shortName: "Canoas" },
  { slug: "gravatai", name: "Gravataí, RS", shortName: "Gravataí" },
  { slug: "esteio", name: "Esteio, RS", shortName: "Esteio" },
  { slug: "sapucaia", name: "Sapucaia do Sul, RS", shortName: "Sapucaia" },
  { slug: "sao-leopoldo", name: "São Leopoldo, RS", shortName: "São Leopoldo" },
  { slug: "novo-hamburgo", name: "Novo Hamburgo, RS", shortName: "Novo Hamburgo" },
  { slug: "guaiba", name: "Guaíba, RS", shortName: "Guaíba" },
  { slug: "eldorado", name: "Eldorado do Sul, RS", shortName: "Eldorado do Sul" },
];

interface CityContextType {
  city: MetroCity;
  setCity: (slug: string) => void;
  isPilot: boolean;
}

const defaultCity = METRO_CITIES[0]; // Viamão por padrão

const CityContext = createContext<CityContextType>({
  city: defaultCity,
  setCity: () => {},
  isPilot: true,
});

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [currentCity, setCurrentCity] = useState<MetroCity>(defaultCity);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hub_selected_city");
      if (saved) {
        const found = METRO_CITIES.find((c) => c.slug === saved);
        if (found) setCurrentCity(found);
      }
    } catch {
      // Ignora erro se localStorage não estiver disponível
    }
  }, []);

  const handleSetCity = (slug: string) => {
    const found = METRO_CITIES.find((c) => c.slug === slug);
    if (found) {
      setCurrentCity(found);
      try {
        localStorage.setItem("hub_selected_city", slug);
      } catch {
        // Ignora
      }
    }
  };

  return (
    <CityContext.Provider
      value={{
        city: currentCity,
        setCity: handleSetCity,
        isPilot: currentCity.slug === "viamao",
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
