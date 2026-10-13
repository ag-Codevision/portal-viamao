import type { CatalogChannel, WorldChannel } from "@/types/world-tv";
import { publicChannel } from "./open-video-sources";
// O catálogo não concede direitos sobre o vídeo. Fontes diretas exigem curadoria explícita.
const reviewedSources = [
  {
    iptvId: "TVCamara.br",
    kind: "hls" as const,
    url: publicChannel.streamUrl,
    watchUrl: publicChannel.sourceUrl,
    evidenceUrl: publicChannel.evidenceUrl,
    provider: "TV Câmara",
  },
];
export function presentChannel(channel: CatalogChannel): WorldChannel {
  const { sources, ...details } = channel;
  const reviewed = reviewedSources.find(
    (source) =>
      channel.iptvId === source.iptvId &&
      sources.some(
        (candidate) =>
          candidate.kind === source.kind && candidate.url === source.url,
      ),
  );
  if (reviewed)
    return {
      ...details,
      sources,
      sourceTypes: [...new Set(sources.map((source) => source.kind))],
      playback: {
        kind: reviewed.kind,
        url: reviewed.url,
        provider: reviewed.provider,
        evidenceUrl: reviewed.evidenceUrl,
      },
      watchUrl: reviewed.watchUrl,
    };

  // 1. Prioriza reprodução direta de stream HLS no player do site
  const hls = sources.find((source) => source.kind === "hls" && source.url);
  if (hls)
    return {
      ...details,
      sources,
      sourceTypes: [...new Set(sources.map((source) => source.kind))],
      playback: {
        kind: "hls",
        url: hls.url,
        provider: channel.name,
        evidenceUrl: channel.website ?? null,
      },
      watchUrl: hls.url,
    };

  // 2. Player incorporado do YouTube
  const youtube = sources.find(
    (source) =>
      source.kind === "youtube" &&
      (/^https:\/\/www\.youtube(-nocookie)?\.com\/embed\/[A-Za-z0-9_-]{11}/.test(
        source.url,
      ) ||
        source.url.includes("youtube.com") ||
        source.url.includes("youtu.be")),
  );
  if (youtube) {
    let embedUrl = youtube.url;
    const match = youtube.url.match(
      /(?:watch\?v=|embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );
    if (match) {
      embedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}`;
    }
    return {
      ...details,
      sources,
      sourceTypes: [...new Set(sources.map((source) => source.kind))],
      playback: {
        kind: "youtube",
        url: embedUrl,
        provider: "YouTube",
        evidenceUrl: "https://www.youtube.com/static?template=terms",
      },
      watchUrl: embedUrl,
    };
  }

  // 3. Fallback se não houver stream HLS nem YouTube compatível
  return {
    ...details,
    sources,
    sourceTypes: [...new Set(sources.map((source) => source.kind))],
    playback: {
      kind: "external",
      url: null,
      provider: channel.countryName ?? "Transmissão",
      evidenceUrl: channel.website ?? null,
    },
    watchUrl: channel.website,
  };
}
