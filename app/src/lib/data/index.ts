import { mockRepository } from "./mock-repository";
import { demoNow, demoDate } from "@/mocks";
import { siteConfig } from "@/lib/config";
import { openVideoRepository } from "./open-video-repository";
export {
  getTvCatalog,
  getWorldChannel,
  getDefaultWorldChannel,
} from "./world-tv-repository";
export const listOpenVideos = () => openVideoRepository.listVideos();
export const getOpenVideo = (slug: string) =>
  openVideoRepository.getVideo(slug);
export {
  searchInternetArchivePublicDomain,
  searchWikimediaCommonsVideos,
} from "./open-video-repository";
// Ponto único de composição: substituir por um adapter Supabase no servidor na Etapa 2.
const repository = mockRepository;
export const {
  getCity,
  listPrograms,
  getProgram,
  getEpisodes,
  getEpisode,
  getLiveChannel,
  getSchedule,
  listJobs,
  getJob,
  getCompany,
  listArticles,
  getArticle,
} = repository;
export async function getHomeFeed(citySlug = siteConfig.citySlug) {
  return {
    programs: await listPrograms({ citySlug }),
    jobs: await listJobs({ citySlug }),
    articles: await listArticles(citySlug),
  };
}
export async function getLiveNow(citySlug = siteConfig.citySlug) {
  const slots = await getSchedule(demoDate, citySlug);
  return {
    channel: await getLiveChannel(citySlug),
    now: slots.find((s) => s.startsAt <= demoNow && s.endsAt > demoNow),
    next: slots.find((s) => s.startsAt > demoNow),
  };
}
