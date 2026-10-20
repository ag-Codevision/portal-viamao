import { normalize } from "@/lib/utils";
import { mockRepository } from "./mock-repository";
import { openVideoRepository } from "./open-video-repository";

export interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  url: string;
  type: "program" | "video" | "job" | "article" | "live";
  coverPath?: string;
  badge?: string;
}

export interface GlobalSearchResults {
  total: number;
  query: string;
  items: SearchItem[];
  categories: {
    programs: SearchItem[];
    videos: SearchItem[];
    jobs: SearchItem[];
    articles: SearchItem[];
    live: SearchItem[];
  };
}

export async function searchGlobal(rawQuery: string): Promise<GlobalSearchResults> {
  const query = rawQuery.trim();
  if (!query) {
    return {
      total: 0,
      query: "",
      items: [],
      categories: { programs: [], videos: [], jobs: [], articles: [], live: [] },
    };
  }

  const q = normalize(query);

  const [programs, videos, jobs, articles] = await Promise.all([
    mockRepository.listPrograms({}),
    openVideoRepository.listVideos(),
    mockRepository.listJobs({}),
    mockRepository.listArticles("viamao"),
  ]);

  const matchedPrograms: SearchItem[] = programs
    .filter(
      (p) =>
        normalize(p.title).includes(q) ||
        normalize(p.synopsis).includes(q) ||
        normalize(p.category).includes(q),
    )
    .map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: `${p.category} • ${p.durationMinutes} min`,
      category: p.category,
      url: `/programas/${p.slug}`,
      type: "program",
      coverPath: p.coverPath,
      badge: "PROGRAMA LOCAL",
    }));

  const matchedVideos: SearchItem[] = videos
    .filter(
      (v) =>
        normalize(v.title).includes(q) ||
        (v.director && normalize(v.director).includes(q)) ||
        normalize(v.synopsis).includes(q),
    )
    .map((v) => ({
      id: v.uuid || v.slug,
      title: v.title,
      subtitle: `${v.year ?? 1900} • ${v.director ? `Dir. ${v.director}` : "Acervo aberto"}`,
      category: "Filme Clássico",
      url: `/assistir/${v.slug}`,
      type: "video",
      coverPath: v.coverPath,
      badge: "DOMÍNIO PÚBLICO",
    }));

  const matchedJobs: SearchItem[] = jobs
    .filter(
      (j) =>
        normalize(j.title).includes(q) ||
        (j.companyName && normalize(j.companyName).includes(q)) ||
        normalize(j.area).includes(q) ||
        normalize(j.locationText).includes(q) ||
        normalize(j.description).includes(q),
    )
    .map((j) => ({
      id: j.id,
      title: j.title,
      subtitle: `${j.companyName ?? "Empresa Local"} • ${j.locationText}`,
      category: j.area,
      url: `/empregos/${j.slug}`,
      type: "job",
      badge: "OPORTUNIDADE",
    }));

  const matchedArticles: SearchItem[] = articles
    .filter(
      (a) =>
        normalize(a.title).includes(q) ||
        normalize(a.excerpt).includes(q) ||
        normalize(a.body).includes(q),
    )
    .map((a) => ({
      id: a.id,
      title: a.title,
      subtitle: a.excerpt,
      category: "Notícias",
      url: `/noticias/${a.slug}`,
      type: "article",
      badge: "REDAÇÃO",
    }));

  const rawLive = [
    {
      id: "live-camara",
      title: "TV Câmara Viamão",
      subtitle: "Transmissões das sessões plenárias e audiências públicas",
      category: "Canal Público",
      url: "/ao-vivo?q=camara",
      type: "live" as const,
      badge: "AO VIVO",
    },
    {
      id: "live-mundo",
      title: "TV do Mundo (Canais Oficiais)",
      subtitle: "Mais de 250 emissoras com transmissões ao vivo",
      category: "TV Ao Vivo",
      url: `/ao-vivo?q=${encodeURIComponent(query)}`,
      type: "live" as const,
      badge: "AO VIVO",
    },
  ];

  const liveChannels: SearchItem[] = rawLive.filter(
    (c) =>
      normalize(c.title).includes(q) ||
      normalize(c.subtitle).includes(q) ||
      normalize(c.category).includes(q),
  );

  const allItems: SearchItem[] = [
    ...matchedPrograms,
    ...matchedVideos,
    ...liveChannels,
    ...matchedJobs,
    ...matchedArticles,
  ];

  return {
    total: allItems.length,
    query,
    items: allItems,
    categories: {
      programs: matchedPrograms,
      videos: matchedVideos,
      live: liveChannels,
      jobs: matchedJobs,
      articles: matchedArticles,
    },
  };
}
