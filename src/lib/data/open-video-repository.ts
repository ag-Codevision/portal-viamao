import { z } from "zod";
import { openVideoSources } from "./open-video-sources";
import type { OpenVideo, OpenVideoRepository } from "@/types/media";

const origin = "https://video.blender.org";
const metadataSchema = z.object({
  uuid: z.string(),
  duration: z.number().positive(),
  embedPath: z.string().regex(/^\/videos\/embed\/[a-zA-Z0-9-]+$/),
  thumbnailPath: z
    .string()
    .regex(/^\/lazy-static\/thumbnails\/[a-zA-Z0-9.-]+$/),
  state: z.object({ id: z.literal(1) }),
  privacy: z.object({ id: z.literal(1) }),
  isLive: z.literal(false),
  nsfw: z.literal(false),
  account: z.object({
    name: z.literal("blender"),
    host: z.literal("video.blender.org"),
  }),
  files: z.array(
    z.object({
      resolution: z.object({ id: z.number() }),
      fileUrl: z.string().url(),
    }),
  ),
});

export function parseOpenVideoMetadata(raw: unknown, uuid: string) {
  const metadata = metadataSchema.parse(raw);
  if (metadata.uuid !== uuid)
    throw new Error("Identificador da fonte divergente");
  for (const file of metadata.files) {
    const url = new URL(file.fileUrl);
    if (
      url.origin !== origin ||
      url.pathname !==
        `/object-storage/web_videos/${uuid}-${file.resolution.id}.mp4` ||
      url.search ||
      url.hash
    )
      throw new Error("URL de vídeo fora da origem autorizada");
  }
  return metadata;
}

export function createOpenVideoRepository(): OpenVideoRepository {
  async function getVideo(slug: string): Promise<OpenVideo | null> {
    const source = openVideoSources.find((video) => video.slug === slug);
    if (!source) return null;

    return {
      slug: source.slug,
      uuid: source.uuid,
      title: source.title,
      director: source.director,
      year: source.year,
      attribution: source.attribution,
      synopsis: source.synopsis,
      durationSeconds: source.durationSeconds,
      license: source.license,
      licenseUrl: source.licenseUrl,
      evidenceUrl: source.evidenceUrl,
      sourceUrl: source.sourceUrl,
      coverPath: source.coverPath,
      embedUrl: source.embedUrl,
      playbackUrl: source.playbackUrl,
      provider: source.provider,
      availability: "ready",
    };
  }
  return {
    getVideo,
    async listVideos() {
      return (
        await Promise.all(
          openVideoSources.map((source) => getVideo(source.slug)),
        )
      ).filter((video): video is OpenVideo => video !== null);
    },
  };
}

/**
 * Consulta a Internet Archive Search API para buscar filmes de domínio público
 */
export async function searchInternetArchivePublicDomain(query: string, limit = 10) {
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://archive.org/advancedsearch.php?q=${encoded}+AND+collection:(feature_films)+AND+mediatype:(movies)&fl[]=identifier,title,year,description,downloads&sort[]=downloads+desc&rows=${limit}&output=json`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.response?.docs || []).map((doc: { identifier: string; title: string; year?: string; description?: string }) => ({
      id: doc.identifier,
      title: doc.title,
      year: doc.year,
      description: doc.description,
      embedUrl: `https://archive.org/embed/${doc.identifier}`,
      thumbnailUrl: `https://archive.org/services/img/${doc.identifier}`,
      detailsUrl: `https://archive.org/details/${doc.identifier}`,
    }));
  } catch {
    return [];
  }
}

/**
 * Consulta a Wikimedia Commons API para buscar vídeos sob licença livre / domínio público
 */
export async function searchWikimediaCommonsVideos(query: string, limit = 10) {
  try {
    const encoded = encodeURIComponent(query);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encoded}+filetype:video&srnamespace=6&format=json&utf8=1&srlimit=${limit}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "HubTVViamao/1.0 (https://portalviamao.exemplo; contato@portalviamao.exemplo)" },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.query?.search || []).map((item: { title: string; snippet: string; pageid: number }) => ({
      title: item.title.replace(/^File:/, ""),
      pageId: item.pageid,
      snippet: item.snippet,
      url: `https://commons.wikimedia.org/wiki/${encodeURIComponent(item.title)}`,
    }));
  } catch {
    return [];
  }
}
export const openVideoRepository = createOpenVideoRepository();
