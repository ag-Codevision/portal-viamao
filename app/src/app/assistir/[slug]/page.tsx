import { notFound } from "next/navigation";
import { getEpisode, listPrograms, getOpenVideo } from "@/lib/data";
import { openVideoSources } from "@/lib/data/open-video-sources";
import { OpenVideoDetail } from "@/components/media/open-video-detail";
import { DemoPlayer } from "@/components/live/demo-player";
import { ButtonLink } from "@/components/ui/button";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return {
    title:
      (await getOpenVideo((await params).slug))?.title ??
      (await getEpisode((await params).slug))?.title ??
      "Episódio não encontrado",
  };
}
export default async function Watch({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const video = await getOpenVideo(slug);
  if (video) return <OpenVideoDetail video={video} />;
  const e = await getEpisode(slug);
  if (!e) notFound();
  const p = (await listPrograms()).find((p) => p.id === e.programId)!;
  return (
    <div className="container page-content">
      <p className="eyebrow">VÍDEO SOB DEMANDA · DEMONSTRAÇÃO</p>
      <h1>{e.title}</h1>
      <DemoPlayer title={p.title} />
      <div className="reading">
        <h2>{p.title}</h2>
        <p>{e.synopsis}</p>
        <p className="muted">
          Vídeo indisponível nesta etapa. Legendas e transcrição serão avaliadas
          com o conteúdo autorizado.
        </p>
        <ButtonLink variant="secondary" href={`/programas/${p.slug}`}>
          Voltar aos episódios
        </ButtonLink>
      </div>
    </div>
  );
}
export const dynamicParams = false;
export async function generateStaticParams() {
  const { getEpisodes } = await import("@/lib/data");
  const programs = await listPrograms();
  const episodes = await Promise.all(programs.map((p) => getEpisodes(p.id)));
  return [
    ...episodes.flat().map((e) => ({ slug: e.slug })),
    ...openVideoSources.map((video) => ({ slug: video.slug })),
  ];
}
