"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Globe2,
  Search,
  Tv,
  MapPin,
  X,
  Radio,
} from "lucide-react";
import { ExternalPlayer } from "@/components/media/external-player";
import { Button } from "@/components/ui/button";
import type {
  TvCatalogResult,
  TvFilters,
  WorldChannel,
} from "@/types/world-tv";

function writeUrl(filters: TvFilters, channelId?: string) {
  const params = new URLSearchParams({
    pais: filters.country,
  });
  if (channelId) params.set("canal", channelId);
  if (filters.state) params.set("estado", filters.state);
  if (filters.city) params.set("cidade", filters.city);
  if (filters.query) params.set("q", filters.query);
  if (filters.page > 1) params.set("pagina", String(filters.page));
  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}?${params}`,
  );
}

export function WorldTvBrowser({
  initialCatalog,
  initialChannel,
}: {
  initialCatalog: TvCatalogResult;
  initialChannel: WorldChannel | null;
}) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [filters, setFilters] = useState(initialCatalog.filters);
  const [query, setQuery] = useState(initialCatalog.filters.query);
  const [selected, setSelected] = useState<WorldChannel | null>(
    initialChannel || null,
  );
  const [selection, setSelection] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const request = useRef<AbortController | null>(null);
  const version = useRef(0);
  const selectedRef = useRef(selected);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  function load(next: TvFilters) {
    setFilters(next);
    setError(null);
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    const ticket = ++version.current;
    startTransition(async () => {
      try {
        const params = new URLSearchParams({
          pais: next.country,
          estado: next.state,
          cidade: next.city,
          q: next.query,
          pagina: String(next.page),
        });
        const response = await fetch(`/api/tv/catalog?${params}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            data.error ?? "Não foi possível carregar o catálogo de canais.",
          );
        if (!Array.isArray(data.items) || !Array.isArray(data.countries))
          throw new Error("O catálogo retornou uma resposta inválida.");
        if (ticket !== version.current) return;
        setCatalog(data as TvCatalogResult);
        setFilters(data.filters);
        writeUrl(data.filters, selectedRef.current?.id);
      } catch (cause) {
        if (!controller.signal.aborted && ticket === version.current)
          setError(
            cause instanceof Error
              ? cause.message
              : "Falha ao carregar o catálogo.",
          );
      }
    });
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      load({ ...filters, query: value, page: 1 });
    }, 350);
  }

  function selectChannel(channel: WorldChannel) {
    selectedRef.current = channel;
    setSelected(channel);
    setSelection((value) => value + 1);
    writeUrl(filters, channel.id);
  }

  const playback = selected?.playback;

  return (
    <div className="live-tv-studio">
      {/* 1. BARRA SUPERIOR DE FILTROS (Acima do vídeo e da sidebar) */}
      <header className="live-top-toolbar" aria-label="Controles e filtros da transmissão">
        <div className="toolbar-headline">
          <div className="headline-badge">
            <span className="live-dot" aria-hidden="true" />
            <h1 className="live-badge-text">TV AO VIVO</h1>
          </div>
          <span className="channel-count-chip">
            {catalog.total.toLocaleString("pt-BR")} canais
          </span>
        </div>

        {/* Pílulas rápidas */}
        <div className="toolbar-pills" role="toolbar" aria-label="Filtros rápidos">
          <button
            type="button"
            className={`pill-btn ${filters.country === "BR" && !filters.state ? "active" : ""}`}
            onClick={() =>
              load({
                country: "BR",
                state: "",
                city: "",
                query: "",
                page: 1,
              })
            }
          >
            🇧🇷 Brasil ({catalog.statistics.brazil})
          </button>
          <button
            type="button"
            className={`pill-btn ${filters.country === "BR" && filters.state === "BR-RS" ? "active" : ""}`}
            onClick={() =>
              load({
                country: "BR",
                state: "BR-RS",
                city: "",
                query: "",
                page: 1,
              })
            }
          >
            📍 RS (Local)
          </button>
          <button
            type="button"
            className={`pill-btn ${filters.country === "" ? "active" : ""}`}
            onClick={() =>
              load({
                country: "",
                state: "",
                city: "",
                query: "",
                page: 1,
              })
            }
          >
            🌐 Mundial ({catalog.statistics.countries} países)
          </button>
        </div>

        {/* Campo de Busca e Dropdowns no Topo */}
        <div className="toolbar-filters-group">
          <form
            className="search-box-top"
            onSubmit={(e) => {
              e.preventDefault();
              load({ ...filters, query, page: 1 });
            }}
          >
            <Search size={14} className="search-icon" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Buscar canal ou cidade…"
              className="top-search-input"
              aria-label="Buscar canal"
            />
            {query && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => {
                  setQuery("");
                  load({ ...filters, query: "", page: 1 });
                }}
                aria-label="Limpar busca"
              >
                <X size={13} />
              </button>
            )}
            <button
              type="submit"
              className="search-submit-btn"
              aria-label="Buscar canais"
            >
              Buscar canais
            </button>
          </form>

          <div className="selects-top-row">
            <select
              id="top-tv-country"
              className="top-select"
              aria-label="Filtrar por país"
              value={filters.country}
              onChange={(e) =>
                load({
                  ...filters,
                  country: e.target.value,
                  state: "",
                  city: "",
                  query,
                  page: 1,
                })
              }
            >
              <option value="">Todos os países</option>
              {catalog.countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>

            {filters.country && catalog.states.length > 0 && (
              <select
                id="top-tv-state"
                className="top-select"
                aria-label="Filtrar por estado"
                disabled={pending}
                value={filters.state}
                onChange={(e) =>
                  load({
                    ...filters,
                    state: e.target.value,
                    city: "",
                    query,
                    page: 1,
                  })
                }
              >
                <option value="">Todos estados</option>
                <option value="__unknown__">Não informado</option>
                {catalog.states.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}

            {filters.country && catalog.cities.length > 0 && (
              <select
                id="top-tv-city"
                className="top-select"
                aria-label="Filtrar por cidade"
                disabled={filters.state === "__unknown__" || pending}
                value={filters.city}
                onChange={(e) =>
                  load({ ...filters, city: e.target.value, query, page: 1 })
                }
              >
                <option value="">Todas cidades</option>
                <option value="__unknown__">Não informada</option>
                {catalog.cities.map((ct) => (
                  <option key={ct.code} value={ct.code}>
                    {ct.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>

      {/* 2. GRID PRINCIPAL (VÍDEO HERO NA ESQUERDA + SIDEBAR DEDICADA NA DIREITA) */}
      <div className="live-main-grid">
        {/* COLUNA HERO DO VÍDEO */}
        <section className="live-video-hero-column" aria-label="Transmissão de vídeo principal">
          {selected && playback ? (
            <>
              {/* O PLAYER É O DESTAQUE PRINCIPAL NA HERO */}
              <div className="video-player-hero-box">
                {playback.kind === "external" && !playback.url ? (
                  <div className="empty-state">
                    <Tv size={42} className="muted" aria-hidden="true" />
                    <h3>Sinal temporariamente indisponível</h3>
                    <p>
                      Selecione outro canal na lista lateral para continuar assistindo imediatamente.
                    </p>
                  </div>
                ) : (
                  <ExternalPlayer
                    key={`${selected.id}:${selection}`}
                    startOnSelection={true}
                    title={selected.name}
                    provider={selected.countryName || "Ao Vivo"}
                    embedUrl={playback.kind === "youtube" ? playback.url : undefined}
                    hlsUrl={
                      playback.kind === "hls"
                        ? (playback.url ?? undefined)
                        : undefined
                    }
                    youtube={playback.kind === "youtube"}
                    sources={selected.sources}
                  />
                )}
              </div>

              {/* Informações da emissora logo abaixo do vídeo */}
              <div className="channel-under-info">
                <div className="under-info-main">
                  <div className="under-channel-monogram" aria-hidden="true">
                    {selected.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="channel-title-row">
                      <h2 className="current-channel-name">{selected.name}</h2>
                      <span className="signal-chip">
                        {playback.kind === "hls" ? "Sinal HLS Direto" : "YouTube Live"}
                      </span>
                    </div>
                    <p className="current-channel-location">
                      <MapPin size={13} className="inline-pin" aria-hidden="true" />{" "}
                      {selected.countryName}
                      {selected.locations.length > 0 &&
                        ` · ${selected.locations
                          .map((l) => l.cityName ?? l.stateName)
                          .filter(Boolean)
                          .slice(0, 2)
                          .join(", ")}`}
                      {selected.geoBlocked && " · Restrição regional possível"}
                    </p>
                  </div>
                </div>

                <div className="under-info-badges">
                  <span className="info-tag">Transmissão Direta</span>
                  <span className="info-tag">Sem Anúncios Externos</span>
                </div>
              </div>
            </>
          ) : (
            <div className="external-player-screen external-player-placeholder">
              <Tv size={48} aria-hidden="true" />
              <p className="eyebrow">PORTAL TV VIAMÃO</p>
              <h2>Escolha um canal para assistir</h2>
              <p>Clique em qualquer emissora na lista ao lado.</p>
            </div>
          )}
        </section>

        {/* SIDEBAR LATERAL DIREITA: APENAS A LISTA DOS BOTÕES DE CANAIS */}
        <aside className="live-sidebar-channel-picker" aria-labelledby="picker-title">
          <div className="picker-header">
            <div className="picker-title-row">
              <Radio size={16} className="brand-accent" aria-hidden="true" />
              <h2 id="picker-title">Canais de TV</h2>
            </div>
            <span className="picker-page-info">
              {catalog.items.length} de {catalog.total.toLocaleString("pt-BR")}
            </span>
          </div>

          {error ? (
            <div className="world-tv-error" role="alert">
              <p>{error}</p>
              <Button
                variant="secondary"
                onClick={() => load({ ...filters, query })}
              >
                Tentar novamente
              </Button>
            </div>
          ) : (
            <div className="channels-scroll-list" aria-busy={pending}>
              {catalog.items.length ? (
                catalog.items.map((channel) => {
                  const isSelected = selected?.id === channel.id;
                  return (
                    <button
                      key={channel.id}
                      className={`channel-item-btn world-tv-channel ${isSelected ? "is-selected" : ""}`}
                      onClick={() => selectChannel(channel)}
                      aria-pressed={isSelected}
                    >
                      <span className="channel-item-monogram" aria-hidden="true">
                        {channel.name.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="channel-item-body">
                        <strong className="channel-item-name">{channel.name}</strong>
                        <span className="channel-item-sub">
                          {channel.locations[0]?.cityName ??
                            channel.locations[0]?.stateName ??
                            channel.countryName}
                        </span>
                        <span className="channel-signal-type">
                          {channel.playback?.kind === "youtube"
                            ? "Player YouTube"
                            : "Sinal oficial"}
                        </span>
                      </span>

                      {isSelected ? (
                        <span className="now-playing-indicator" title="Transmitindo agora">
                          <span className="wave-bar bar-1" />
                          <span className="wave-bar bar-2" />
                          <span className="wave-bar bar-3" />
                        </span>
                      ) : (
                        <span className="play-icon-hover" aria-hidden="true">
                          ▶
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="world-tv-empty" role="status">
                  <p>Nenhum canal encontrado.</p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setQuery("");
                      load({
                        country: filters.country,
                        state: "",
                        city: "",
                        query: "",
                        page: 1,
                      });
                    }}
                  >
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Paginação da Sidebar */}
          <div className="picker-pagination">
            <button
              className="icon-button"
              aria-label="Página anterior de canais"
              disabled={pending || catalog.page <= 1}
              onClick={() => load({ ...catalog.filters, page: catalog.page - 1 })}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pagination-text">
              Página {catalog.page} de {catalog.pages}
            </span>
            <button
              className="icon-button"
              aria-label="Próxima página de canais"
              disabled={pending || catalog.page >= catalog.pages}
              onClick={() => load({ ...catalog.filters, page: catalog.page + 1 })}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
