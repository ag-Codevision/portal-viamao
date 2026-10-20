import Link from "next/link";
import { Search, Film, Tv, Radio, Briefcase, Newspaper, ArrowRight } from "lucide-react";
import { searchGlobal } from "@/lib/data/global-search";
import { EmptyState } from "@/components/ui/states";

export const metadata = { title: "Busca na Plataforma · Hub TV" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const p = await searchParams;
  const query = p.q ?? "";
  const results = await searchGlobal(query);

  const popularSearches = [
    "Entre Águas",
    "TV Câmara",
    "Gente Daqui",
    "Documentários",
    "Comércio",
    "Charlie Chaplin",
    "Notícias",
  ];

  return (
    <div className="container page-content search-page">
      <div className="search-hero">
        <span className="eyebrow-badge">
          <Search size={13} aria-hidden="true" />
          BUSCA GLOBAL DA PLATAFORMA
        </span>
        <h1 className="search-main-title">O que você quer assistir ou encontrar?</h1>
        <p className="search-hero-subtitle">
          Pesquise por programas, filmes de domínio público, canais ao vivo, notícias ou vagas de oportunidades em Viamão.
        </p>

        <form action="/busca" method="GET" className="global-search-form">
          <div className="global-search-input-wrap">
            <Search size={20} className="global-search-icon" aria-hidden="true" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Digite o nome de um programa, filme, canal ou vaga…"
              className="global-search-field"
              aria-label="Pesquisar em toda a plataforma Hub TV"
              autoFocus
            />
            <button type="submit" className="global-search-submit">
              Buscar
            </button>
          </div>
        </form>

        <div className="popular-tags-row">
          <span className="popular-label">Mais buscados:</span>
          {popularSearches.map((term) => (
            <Link
              key={term}
              href={`/busca?q=${encodeURIComponent(term)}`}
              className="popular-tag"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>

      {query ? (
        <section className="search-results-section" aria-label="Resultados da pesquisa">
          <div className="search-results-header">
            <h2>
              {results.total === 0
                ? `Nenhum resultado encontrado para "${query}"`
                : `${results.total} ${
                    results.total === 1 ? "resultado encontrado" : "resultados encontrados"
                  } para "${query}"`}
            </h2>
          </div>

          {results.total === 0 ? (
            <EmptyState
              title="Nada por aqui com esses termos"
              description="Tente buscar por palavras mais gerais como 'Documentários', 'Notícias', 'Comércio' ou navegue pelos nossos destaques."
              action="Ver programas em destaque"
              href="/programas"
            />
          ) : (
            <div className="search-results-grid">
              {results.items.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  href={item.url}
                  className="search-result-card"
                >
                  <div className="result-card-header">
                    <span className="result-type-badge">
                      {item.type === "program" && <Tv size={12} />}
                      {item.type === "video" && <Film size={12} />}
                      {item.type === "live" && <Radio size={12} />}
                      {item.type === "job" && <Briefcase size={12} />}
                      {item.type === "article" && <Newspaper size={12} />}
                      {item.badge}
                    </span>
                    <span className="result-category">{item.category}</span>
                  </div>

                  <h3 className="result-title">{item.title}</h3>
                  <p className="result-subtitle">{item.subtitle}</p>

                  <span className="result-action-link">
                    Acessar <ArrowRight size={14} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="search-explore-section">
          <h2>Explore as áreas da Hub TV</h2>
          <div className="explore-categories-grid">
            <Link href="/programas" className="explore-card">
              <Tv size={28} className="explore-icon" />
              <h3>Programas Locais</h3>
              <p>Produções audiovisuais, cultura e memórias da nossa terra.</p>
            </Link>
            <Link href="/ao-vivo" className="explore-card">
              <Radio size={28} className="explore-icon" />
              <h3>TV ao Vivo</h3>
              <p>Mais de 250 emissoras oficiais do Brasil e do mundo.</p>
            </Link>
            <Link href="/documentarios" className="explore-card">
              <Film size={28} className="explore-icon" />
              <h3>Documentários</h3>
              <p>Expedições, natureza e grandes narrativas históricas.</p>
            </Link>
            <Link href="/empregos" className="explore-card">
              <Briefcase size={28} className="explore-icon" />
              <h3>Oportunidades</h3>
              <p>Conectando quem contrata com quem procura trabalho em Viamão.</p>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
