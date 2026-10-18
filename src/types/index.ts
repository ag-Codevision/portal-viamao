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
export type JobStatus =
  | "published"
  | "paused"
  | "filled"
  | "archived"
  | "pending_review"
  | "expired";

export type JobApplicationStatus =
  | "submitted"
  | "under_review"
  | "interview"
  | "approved"
  | "rejected";

export interface Company {
  id: string;
  cityId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  contactEmail?: string;
  phone?: string;
  websiteUrl?: string;
  status?: "pending" | "active" | "suspended";
  planType?: "assinante" | "anunciante" | "gratuito";
}

export interface JobQuestion {
  id: string;
  jobId?: string;
  prompt: string;
  type: "text" | "choice" | "boolean";
  options?: string[];
  required: boolean;
  order: number;
}

export interface ApplicationAnswer {
  questionId: string;
  prompt: string;
  answer: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  resumeUrl?: string;
  resumeName?: string;
  videoPitchUrl?: string;
  videoPitchDuration?: number;
  videoPitchSize?: number;
  status: JobApplicationStatus;
  appliedAt: string;
  recruiterNotes?: string;
  answers: ApplicationAnswer[];
}

export interface Job {
  id: string;
  cityId: string;
  companyId: string;
  companyName?: string;
  companyLogoUrl?: string;
  slug: string;
  title: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  area: string;
  employmentType: string;
  workMode: string;
  shift?: string;
  locationText: string;
  salary: string | null;
  salaryMin?: number;
  salaryMax?: number;
  salaryIsPublic?: boolean;
  publishedAt: string;
  expiresAt: string;
  applicationUrl: string | null;
  status: JobStatus;
  questions?: JobQuestion[];
  applicationsCount?: number;
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
  employmentType?: string;
  shift?: string;
  status?: JobStatus;
  publishedAfter?: string;
  citySlug?: string;
}

