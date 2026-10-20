"use client";

import { useCity } from "@/lib/context/city-context";
import { MapPin, Info, ArrowRight } from "lucide-react";

export function CityNoticeBanner() {
  const { city, isPilot, setCity } = useCity();

  if (isPilot) return null;

  return (
    <div className="city-notice-banner" role="status" aria-live="polite">
      <div className="container city-notice-inner">
        <div className="city-notice-message">
          <span className="city-notice-badge">
            <MapPin size={13} aria-hidden="true" />
            {city.name}
          </span>
          <p>
            <strong>Edição Regional em Expansão:</strong> O HUB TV está preparando
            conteúdos, canais comunitários e vagas exclusivas para {city.shortName}. Enquanto isso,
            você acessa a programação demonstrativa de Viamão e o acervo geral da Grande Porto Alegre!
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCity("viamao")}
          className="city-notice-reset-btn"
          aria-label="Voltar para a edição de Viamão"
        >
          Voltar para Viamão <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
