import type { OpenVideo } from "@/types/media";
import { ExternalPlayer } from "./external-player";
import { ButtonLink } from "@/components/ui/button";
export function OpenVideoDetail({ video }: { video: OpenVideo }) {
  return (
    <div className="container page-content">
      <p className="eyebrow">FILME REAL · {video.license}</p>
      <h1>{video.title}</h1>
      <p className="page-intro">{video.synopsis}</p>
      <ExternalPlayer
        title={video.title}
        embedUrl={video.embedUrl}
        sourceUrl={video.sourceUrl}
        provider={video.provider || "Cinema em Domínio Público"}
        playbackUrl={video.playbackUrl}
        poster={video.coverPath}
        muted={false}
      />
      <div className="reading">
        <h2>Créditos e Domínio Público</h2>
        {video.director && (
          <p>
            <strong>Direção original:</strong> {video.director}{" "}
            {video.year ? `· Lançamento: ${video.year}` : ""}
          </p>
        )}
        <p>
          {video.attribution}. Obra cinematográfica de domínio público / licença aberta.
        </p>
        <p>
          <a
            className="text-link"
            href={video.licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Licença {video.license} ↗
          </a>{" "}
          ·{" "}
          <a
            className="text-link"
            href={video.evidenceUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Permissão publicada pelo titular ↗
          </a>
        </p>
        <p className="muted">
          O filme conserva o áudio original. A API não disponibilizou legendas
          para estes arquivos. Consulte outras versões e recursos na página
          oficial.
        </p>
        <ButtonLink href="/programas#filmes-abertos" variant="secondary">
          Voltar ao catálogo
        </ButtonLink>
      </div>
    </div>
  );
}
