export type EditorialStatus = "draft" | "review" | "published" | "archived";
export type DataState<T> =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };
export interface City {
  id: string;
  slug: string;
  name: string;
  stateCode: string;
  timezone: string;
}
export interface Program {
  id: string;
  cityId: string;
  slug: string;
  title: string;
  synopsis: string;
  category: string;
  coverPath: string;
  status: EditorialStatus;
  durationMinutes: number;
  featured?: boolean;
}
export interface Episode {
  id: string;
  programId: string;
  slug: string;
  title: string;
  synopsis: string;
  durationSeconds: number;
  videoProvider: "demo" | "youtube";
  videoExternalId: string | null;
  status: EditorialStatus;
}
export interface ScheduleSlot {
  id: string;
  cityId: string;
  startsAt: string;
  endsAt: string;
  programId: string;
  label: string;
}
export interface LiveChannel {
  id: string;
  cityId: string;
  provider: "demo" | "youtube";
  publicStatus: "demo" | "offline" | "live";
  embedUrl: string | null;
}
export interface Company {
  id: string;
  cityId: string;
  name: string;
  slug: string;
}
export interface Job {
  id: string;
  cityId: string;
  companyId: string;
  companyName?: string;
  slug: string;
  title: string;
  description: string;
  requirements: string[];
  area: string;
  employmentType: string;
  workMode: string;
  locationText: string;
  salary: string | null;
  publishedAt: string;
  expiresAt: string;
  applicationUrl: string | null;
  status: "published" | "expired";
}
export interface Article {
  id: string;
  cityId: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverPath: string;
  publishedAt: string;
  status: EditorialStatus;
}
export interface ProgramFilters {
  query?: string;
  category?: string;
  citySlug?: string;
}
export interface JobFilters {
  query?: string;
  area?: string;
  workMode?: string;
  publishedAfter?: string;
  citySlug?: string;
}
