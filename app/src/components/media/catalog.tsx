import { listPrograms, listOpenVideos } from "@/lib/data";
import { normalize } from "@/lib/utils";
import { OpenVideoCollection } from "./open-video-collection";
import { MediaCard } from "./media-card";
import { EmptyState } from "@/components/ui/states";
export async function Catalog({
  query,
  category,
  documentaries = false,
}: {
  query?: string;
  category?: string;
  documentaries?: boolean;
}) {
  const programs = await listPrograms({
    query,
    category: documentaries ? "Documentários" : category,
    citySlug: "viamao",
  });
  const videos =
    !documentaries && (!category || category === "Cinema de licença aberta")
      ? (await listOpenVideos()).filter(
          (video) =>
            !query ||
            normalize(`${video.title} ${video.synopsis}`).includes(
              normalize(query),
            ),
        )
      : [];
  return (
    <>
      <form
        action={documentaries ? "/documentarios" : "/programas"}
        className="filter-form"
        id="busca"
      >
        <label htmlFor="q">
          Buscar programas
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Uma história, um tema, um lugar…"
          />
        </label>
        {!documentaries && (
          <label htmlFor="categoria">
            Categoria
            <select
              name="categoria"
              id="categoria"
              defaultValue={category ?? ""}
            >
              <option value="">Todas as categorias</option>
              {[
                "Documentários",
                "Jornalismo",
                "Histórias de Viamão",
                "Cultura",
                "Cinema de licença aberta",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        )}
        <button className="button button-primary" type="submit">
          Buscar
        </button>
      </form>
      <p className="results-count" role="status">
        {programs.length}{" "}
        {programs.length === 1
          ? "programa encontrado"
          : "programas encontrados"}{" "}
        · Produções locais fictícias
        {videos.length > 0 && ` · ${videos.length} filmes de licença aberta`}
      </p>
      {programs.length ? (
        <div className="media-grid">
          {programs.map((p) => (
            <MediaCard key={p.id} program={p} />
          ))}
        </div>
      ) : !videos.length ? (
        <EmptyState href={documentaries ? "/documentarios" : "/programas"} />
      ) : null}
      <OpenVideoCollection videos={videos} />
    </>
  );
}
