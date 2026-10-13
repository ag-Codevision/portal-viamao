import type {
  Article,
  City,
  Company,
  Episode,
  Job,
  JobFilters,
  LiveChannel,
  Program,
  ProgramFilters,
  ScheduleSlot,
} from "@/types";
export interface PortalRepository {
  getCity(slug: string): Promise<City | null>;
  listPrograms(filters?: ProgramFilters): Promise<Program[]>;
  getProgram(slug: string): Promise<Program | null>;
  getEpisodes(programId: string): Promise<Episode[]>;
  getEpisode(slug: string): Promise<Episode | null>;
  getLiveChannel(citySlug: string): Promise<LiveChannel | null>;
  getSchedule(date: string, citySlug: string): Promise<ScheduleSlot[]>;
  listJobs(filters?: JobFilters): Promise<Job[]>;
  getJob(slug: string): Promise<Job | null>;
  getCompany(id: string): Promise<Company | null>;
  listArticles(citySlug: string): Promise<Article[]>;
  getArticle(slug: string): Promise<Article | null>;
}
