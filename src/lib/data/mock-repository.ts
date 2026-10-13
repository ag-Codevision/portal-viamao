import {
  articles,
  channel,
  city,
  companies,
  demoNow,
  episodes,
  jobs,
  programs,
} from "@/mocks";
import { normalize } from "@/lib/utils";
import type { PortalRepository } from "./contracts";
export const mockRepository: PortalRepository = {
  async getCity(slug) {
    return slug === city.slug ? city : null;
  },
  async listPrograms(filters = {}) {
    return programs.filter(
      (p) =>
        p.status === "published" &&
        (!filters.citySlug || filters.citySlug === city.slug) &&
        (!filters.category || p.category === filters.category) &&
        (!filters.query ||
          normalize(`${p.title} ${p.synopsis}`).includes(
            normalize(filters.query),
          )),
    );
  },
  async getProgram(slug) {
    return (
      programs.find((p) => p.slug === slug && p.status === "published") ?? null
    );
  },
  async getEpisodes(id) {
    return episodes.filter(
      (e) => e.programId === id && e.status === "published",
    );
  },
  async getEpisode(slug) {
    return (
      episodes.find((e) => e.slug === slug && e.status === "published") ?? null
    );
  },
  async getLiveChannel(slug) {
    return slug === city.slug ? channel : null;
  },
  async getSchedule(date, slug) {
    if (
      slug !== city.slug ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(`${date}T00:00:00Z`))
    )
      return [];
    return programs.slice(0, 4).map((p, i) => ({
      id: `slot-${date}-${i}`,
      cityId: city.id,
      programId: p.id,
      label: p.title,
      startsAt: new Date(
        `${date}T${String(17 + i).padStart(2, "0")}:00:00-03:00`,
      ).toISOString(),
      endsAt: new Date(
        `${date}T${String(18 + i).padStart(2, "0")}:00:00-03:00`,
      ).toISOString(),
    }));
  },
  async listJobs(filters = {}) {
    return jobs.filter(
      (j) =>
        j.status === "published" &&
        j.expiresAt > demoNow &&
        (!filters.citySlug || filters.citySlug === city.slug) &&
        (!filters.query ||
          normalize(`${j.title} ${j.description} ${j.locationText}`).includes(
            normalize(filters.query),
          )) &&
        (!filters.area || j.area === filters.area) &&
        (!filters.workMode || j.workMode === filters.workMode) &&
        (!filters.publishedAfter || j.publishedAt >= filters.publishedAfter),
    );
  },
  async getJob(slug) {
    return (
      jobs.find(
        (j) =>
          j.slug === slug && j.status === "published" && j.expiresAt > demoNow,
      ) ?? null
    );
  },
  async getCompany(id) {
    return companies.find((c) => c.id === id) ?? null;
  },
  async listArticles(slug) {
    return slug === city.slug
      ? articles.filter((a) => a.status === "published")
      : [];
  },
  async getArticle(slug) {
    return (
      articles.find((a) => a.slug === slug && a.status === "published") ?? null
    );
  },
};
