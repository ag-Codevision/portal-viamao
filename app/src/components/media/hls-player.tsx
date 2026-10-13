"use client";
import { useEffect, useRef } from "react";
import type Hls from "hls.js";
export function HlsPlayer({
  source,
  title,
  onError,
  autoStart = false,
  muted = false,
}: {
  source: string;
  title: string;
  onError: () => void;
  autoStart?: boolean;
  muted?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let disposed = false;
    let decoder: Hls | undefined;

    video.muted = muted;
    video.volume = 1;

    const playVideo = () => {
      if (!autoStart || disposed) return;
      video.muted = muted;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Fallback caso a política do navegador exija mudo antes do primeiro gesto
          if (!disposed && !muted) {
            video.muted = true;
            video.play().catch(() => {});
            const unmute = () => {
              if (video && !disposed) {
                video.muted = false;
              }
              window.removeEventListener("click", unmute);
              window.removeEventListener("keydown", unmute);
            };
            window.addEventListener("click", unmute, { once: true });
            window.addEventListener("keydown", unmute, { once: true });
          }
        });
      }
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      playVideo();
    } else {
      import("hls.js")
        .then(({ default: Hls }) => {
          if (disposed) return;
          if (!Hls.isSupported()) {
            onError();
            return;
          }
          decoder = new Hls({
            enableWorker: true,
            maxBufferLength: 20,
            backBufferLength: 0,
          });
          decoder.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal && !disposed) onError();
          });
          decoder.on(Hls.Events.MANIFEST_PARSED, () => {
            playVideo();
          });
          decoder.loadSource(source);
          decoder.attachMedia(video);
        })
        .catch(() => {
          if (!disposed) onError();
        });
    }

    return () => {
      disposed = true;
      decoder?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [source, onError, autoStart, muted]);

  return (
    <video
      ref={ref}
      controls
      playsInline
      preload="auto"
      autoPlay={autoStart}
      muted={muted}
      onError={onError}
      aria-label={`Reproduzir ${title}`}
      data-source={source}
    >
      Seu navegador não suporta este sinal. Use o link da emissora.
    </video>
  );
}
