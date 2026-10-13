export interface OpenVideo {
  slug: string;
  uuid: string;
  title: string;
  synopsis: string;
  durationSeconds: number;
  license: string;
  licenseUrl: string;
  evidenceUrl: string;
  attribution: string;
  sourceUrl: string;
  coverPath: string;
  embedUrl: string | null;
  playbackUrl: string | null;
  availability: "ready" | "unavailable";
  year?: number;
  director?: string;
  provider?: string;
}
export interface OpenVideoRepository {
  listVideos(): Promise<OpenVideo[]>;
  getVideo(slug: string): Promise<OpenVideo | null>;
}
