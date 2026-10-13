import Image from "next/image";
import Link from "next/link";
import { listOpenVideos } from "@/lib/data";
import { SectionHeading } from "@/components/ui/states";
import type { OpenVideo } from "@/types/media";
export async function OpenVideoCollection({
  videos: providedVideos,
}: { videos?: OpenVideo[] } = {}) {
  const videos = providedVideos ?? (await listOpenVideos());
  if (!videos.length) return null;
  return (
    <section className="home-section" id="filmes-abertos">
      <SectionHeading
        kicker="CINEMA HISTÓRICO · DOMÍNIO PÚBLICO & CREATIVE COMMONS"
        title="Grandes Clássicos do Cinema Livre"
      />
      <p className="muted">
        Obras consagradas da história do cinema (Charles Chaplin, Georges Méliès, Buster Keaton, F.W. Murnau e mais) preservadas pelo Internet Archive e Wikimedia Commons, 100% livres de copyright e prontas para assistir.
      </p>
      <div className="media-grid">
        {videos.map((video) => (
          <Link
            key={video.slug}
            href={`/assistir/${video.slug}`}
            className="media-card"
          >
            <div className="card-image">
              <Image
                src={video.coverPath}
                alt={
                  video.availability === "ready"
                    ? `Cena de ${video.title}`
                    : `Ilustração para ${video.title}`
                }
                fill
                sizes="(max-width:640px) 45vw, 33vw"
              />
              <span className="card-duration">
                {Math.ceil(video.durationSeconds / 60)} min
              </span>
            </div>
            <p className="card-category">
              {video.provider ? `${video.provider} · ` : ""}
              {video.license}
            </p>
            <h3>{video.title}</h3>
            {video.director && (
              <p className="card-director muted" style={{ fontSize: "12px", marginTop: "2px" }}>
                Direção: {video.director} {video.year ? `(${video.year})` : ""}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
