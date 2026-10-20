"use client";
import { useState, useCallback } from "react";
import { HlsPlayer } from "./hls-player";
import { Play, RotateCw, Radio, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExternalPlayer({
  title,
  embedUrl,
  provider,
  playbackUrl,
  poster,
  hlsUrl,
  startOnSelection = true,
  muted = false,
  youtube = false,
  sources,
  hideSupportBar = false,
}: {
  title: string;
  embedUrl?: string | null;
  sourceUrl?: string;
  provider: string;
  playbackUrl?: string | null;
  poster?: string;
  hlsUrl?: string;
  garden?: boolean;
  startOnSelection?: boolean;
  muted?: boolean;
  youtube?: boolean;
  sources?: { kind: "hls" | "youtube"; url: string; quality: string | null }[];
  hideSupportBar?: boolean;
}) {
  const [activeSourceIndex, setActiveSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const availableSources = sources && sources.length > 0
    ? sources
    : hlsUrl
      ? [{ kind: "hls" as const, url: hlsUrl, quality: null }]
      : embedUrl && youtube
        ? [{ kind: "youtube" as const, url: embedUrl, quality: null }]
        : [];

  const currentSource = availableSources[activeSourceIndex];
  const isHls = currentSource ? currentSource.kind === "hls" : !!hlsUrl;
  const isYoutube = currentSource ? currentSource.kind === "youtube" : youtube;
  const activeUrl = currentSource ? currentSource.url : (hlsUrl || embedUrl || playbackUrl);

  const fail = useCallback(() => setFailed(true), []);

  const iframeUrl =
    isYoutube && activeUrl
      ? `${activeUrl}?playsinline=1&autoplay=1${muted ? "&mute=1" : ""}`
      : activeUrl;

  return (
    <section className="external-player" aria-label={`Player de ${title}`}>
      <div className="external-player-screen">
        {activeUrl && !failed ? (
          isHls ? (
            <HlsPlayer
              key={`${activeUrl}:${attempt}`}
              source={activeUrl}
              title={title}
              onError={fail}
              autoStart={startOnSelection}
              muted={muted}
            />
          ) : playbackUrl ? (
            <video
              key={`${activeUrl}:${attempt}`}
              controls
              playsInline
              preload="auto"
              autoPlay={startOnSelection}
              muted={muted}
              poster={poster}
              src={playbackUrl}
              onError={() => setFailed(true)}
              aria-label={`Reproduzir ${title}`}
            >
              Seu navegador não suporta este vídeo.
            </video>
          ) : (
            <iframe
              key={`${activeUrl}:${attempt}`}
              src={iframeUrl ?? undefined}
              title={`${title} — transmissão oficial`}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-presentation"
              onError={() => setFailed(true)}
            />
          )
        ) : (
          <div className="external-player-placeholder">
            <AlertCircle size={36} className="text-red-500" aria-hidden="true" />
            <p className="eyebrow">{provider} · SINAL TEMPORARIAMENTE INDISPONÍVEL</p>
            <h2>{title}</h2>
            <p>
              {failed
                ? "Este sinal está enfrentando oscilações ou instabilidade na transmissão de origem."
                : "Não há transmissão ao vivo ativa para este canal no momento."}
            </p>
            <div className="player-retry-actions">
              <Button
                onClick={() => {
                  setFailed(false);
                  setAttempt((value) => value + 1);
                }}
              >
                <RotateCw size={16} /> Tentar reconectar
              </Button>
              {availableSources.length > 1 && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFailed(false);
                    setActiveSourceIndex((prev) => (prev + 1) % availableSources.length);
                    setAttempt((value) => value + 1);
                  }}
                >
                  <Radio size={16} /> Alternar sinal ({activeSourceIndex + 1}/{availableSources.length})
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {!hideSupportBar && (
        <div className="external-player-support">
          <div className="player-meta-badges">
            <span className="live-pill">
              <span className="live-dot" aria-hidden="true" /> AO VIVO NO PORTAL
            </span>
            <span className="player-provider-label">
              {provider} · Transmissão Interna
            </span>
            {availableSources.length > 1 && (
              <div className="stream-selector">
                <span className="stream-selector-label">Sinais:</span>
                {availableSources.map((s, idx) => (
                  <button
                    key={idx}
                    className={`stream-pill ${activeSourceIndex === idx ? "is-active" : ""}`}
                    onClick={() => {
                      setActiveSourceIndex(idx);
                      setFailed(false);
                      setAttempt((a) => a + 1);
                    }}
                  >
                    Sinal {idx + 1} {s.quality ? `(${s.quality})` : ""}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="player-utility-buttons">
            <Button
              variant="ghost"
              onClick={() => {
                setFailed(false);
                setAttempt((v) => v + 1);
              }}
              title="Recarregar sinal de transmissão"
            >
              <RotateCw size={14} /> Recarregar sinal
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
