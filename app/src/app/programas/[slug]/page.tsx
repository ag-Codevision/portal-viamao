import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProgram, getEpisodes, listPrograms } from "@/lib/data";
import { ButtonLink } from "@/components/ui/button";
import { MediaCard } from "@/components/media/media-card";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await getProgram((await params).slug);
  return { title: p?.title ?? "Programa não encontrado" };
}
export default async function ProgramDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await getProgram((await params).slug);
  if (!p) notFound();
  const episodes = await getEpisodes(p.id);
  const related = (await listPrograms({ category: p.category })).filter(
    (x) => x.id !== p.id,
  );
  return (
    <div className="container page-content">
      <Link className="text-link" href="/programas">
        ← Voltar aos programas
      </Link>
      <div className="program-detail">
        <div>
          <p className="eyebrow">{p.category} · CONTEÚDO FICTÍCIO</p>
          <h1>{p.title}</h1>
          <p className="page-intro">{p.synopsis}</p>
          <p className="muted">
            {p.durationMinutes} min por episódio · 1 temporada demonstrativa
          </p>
          <ButtonLink href={`/assistir/${episodes[0].slug}`}>
            Explorar prévia do episódio
          </ButtonLink>
        </div>
        <div className="detail-cover">
          <Image
            src={p.coverPath}
            alt={`Ilustração conceitual de ${p.title}`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      </div>
      <section className="home-section">
        <h2>Episódios</h2>
        <div className="episode-list">
          {episodes.map((e, i) => (
            <Link key={e.id} href={`/assistir/${e.slug}`}>
              <span className="episode-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{e.title}</h3>
                <p>{e.synopsis}</p>
              </div>
              <span>{Math.round(e.durationSeconds / 60)} min ↗</span>
            </Link>
          ))}
        </div>
      </section>
      {related.length > 0 && (
        <section className="home-section">
          <h2>Mais para descobrir</h2>
          <div className="media-grid">
            {related.map((p) => (
              <MediaCard key={p.id} program={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await listPrograms()).map((p) => ({ slug: p.slug }));
}
