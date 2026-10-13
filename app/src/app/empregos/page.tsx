import Link from "next/link";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Send,
  Search,
  Briefcase,
  Store,
  Package,
} from "lucide-react";
import { listJobs } from "@/lib/data";
import { JobCard } from "@/components/jobs/job-card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";

export const metadata = { title: "Empregos em Viamão · Balcão Comunitário" };

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    area?: string;
    modalidade?: string;
    periodo?: string;
  }>;
}) {
  const p = await searchParams;
  const dates: Record<string, string> = {
    "3": "2026-10-09T00:00:00Z",
    "7": "2026-10-05T00:00:00Z",
  };

  const jobs = await listJobs({
    query: p.q,
    area: p.area,
    workMode: p.modalidade,
    publishedAfter: dates[p.periodo ?? ""],
    citySlug: "viamao",
  });

  const activeFilter = p.area || p.modalidade || (p.q ? `Busca: "${p.q}"` : null);

  return (
    <div className="container page-content jobs-page">
      {/* Hero da Página de Empregos */}
      <section className="jobs-hero-card">
        <div className="jobs-hero-content">
          <span className="eyebrow-badge">
            <Sparkles size={13} aria-hidden="true" />
            BALCÃO COMUNITÁRIO · SERVIÇO 100% GRATUITO
          </span>
          <h1>
            O próximo passo profissional{" "}
            <span className="gold-highlight">começa em Viamão</span>.
          </h1>
          <p className="page-intro">
            Aproximamos quem busca trabalho das empresas, lojas e cooperativas da nossa cidade.
            Sem taxas, sem currículos retidos e com transparência para a comunidade.
          </p>

          <div className="jobs-hero-actions">
            <ButtonLink href="/empregos/publicar" variant="default">
              Divulgar vaga gratuitamente ↗
            </ButtonLink>
            <a href="#vagas-list" className="button button-secondary">
              Ver vagas abertas ↓
            </a>
          </div>
        </div>

        {/* Pilares Comunitários */}
        <div className="jobs-metrics-grid">
          <div className="metric-box">
            <div className="metric-icon-wrap" aria-hidden="true">
              <MapPin size={20} />
            </div>
            <div>
              <strong>100% Viamonense</strong>
              <p>Oportunidades no Centro, Santa Isabel, Viamópolis e bairros vizinhos.</p>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap" aria-hidden="true">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <strong>Custo Zero</strong>
              <p>Totalmente gratuito para candidatos e comerciantes locais.</p>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap" aria-hidden="true">
              <Send size={20} />
            </div>
            <div>
              <strong>Candidatura Direta</strong>
              <p>Você fala diretamente com a empresa, sem intermediários.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Busca e Filtros */}
      <section className="jobs-filter-panel" id="vagas-list">
        <div className="filter-panel-header">
          <div>
            <h2 className="filter-title">Buscar Oportunidades</h2>
            <p className="filter-subtitle">
              Filtre por cargo, bairro de Viamão ou modalidade de contratação.
            </p>
          </div>
          {activeFilter && (
            <Link href="/empregos" className="clear-filters-link">
              Limpar filtros ✕
            </Link>
          )}
        </div>

        <form className="filter-form jobs-filters-modern" action="/empregos">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" aria-hidden="true" />
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={p.q}
              placeholder="Ex: atendente, comércio, Santa Isabel, Centro..."
              aria-label="Buscar vaga por cargo ou bairro"
            />
          </div>

          <div className="select-filters-row">
            <label htmlFor="area" className="filter-select-label">
              <span>Área:</span>
              <select id="area" name="area" defaultValue={p.area ?? ""}>
                <option value="">Todas as áreas</option>
                {["Comércio", "Administrativo", "Logística"].map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>

            <label htmlFor="modalidade" className="filter-select-label">
              <span>Modalidade:</span>
              <select
                id="modalidade"
                name="modalidade"
                defaultValue={p.modalidade ?? ""}
              >
                <option value="">Todas as modalidades</option>
                {["Presencial", "Híbrido", "Remoto"].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>

            <label htmlFor="periodo" className="filter-select-label">
              <span>Período:</span>
              <select id="periodo" name="periodo" defaultValue={p.periodo ?? ""}>
                <option value="">Qualquer data</option>
                <option value="3">Últimos 3 dias</option>
                <option value="7">Últimos 7 dias</option>
              </select>
            </label>

            <button type="submit" className="button button-primary filter-submit-btn">
              Filtrar Vagas
            </button>
          </div>
        </form>

        {/* Filtros Rápidos (Pills) */}
        <div className="quick-filter-pills-bar">
          <span className="pills-legend">Filtro rápido:</span>
          <Link
            href="/empregos"
            className={`filter-pill ${!p.area && !p.modalidade && !p.q ? "active" : ""}`}
          >
            Todas as vagas
          </Link>
          <Link
            href="/empregos?area=Comércio"
            className={`filter-pill ${p.area === "Comércio" ? "active" : ""}`}
          >
            <Store size={13} aria-hidden="true" /> Comércio
          </Link>
          <Link
            href="/empregos?area=Administrativo"
            className={`filter-pill ${p.area === "Administrativo" ? "active" : ""}`}
          >
            <Briefcase size={13} aria-hidden="true" /> Administrativo
          </Link>
          <Link
            href="/empregos?area=Logística"
            className={`filter-pill ${p.area === "Logística" ? "active" : ""}`}
          >
            <Package size={13} aria-hidden="true" /> Logística
          </Link>
          <Link
            href="/empregos?modalidade=Presencial"
            className={`filter-pill ${p.modalidade === "Presencial" ? "active" : ""}`}
          >
            Presencial
          </Link>
          <Link
            href="/empregos?modalidade=Híbrido"
            className={`filter-pill ${p.modalidade === "Híbrido" ? "active" : ""}`}
          >
            Híbrido
          </Link>
        </div>
      </section>

      {/* Contagem de Resultados */}
      <div className="results-status-bar" role="status">
        <span className="status-count-tag">
          {jobs.length} {jobs.length === 1 ? "vaga disponível" : "vagas disponíveis"}
        </span>
        <span className="status-note">
          Versão demonstrativa comunitária · Referência piloto: Viamão/RS
        </span>
      </div>

      {/* Grid de Vagas */}
      {jobs.length ? (
        <div className="job-grid jobs-main-grid">
          {jobs.map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
        </div>
      ) : (
        <EmptyState title="Nenhuma vaga encontrada para este filtro" href="/empregos" />
      )}

      {/* Callout de Privacidade e Envio de Vagas */}
      <div className="jobs-community-footer-banner">
        <div className="footer-banner-left">
          <div className="shield-icon-badge" aria-hidden="true">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4>Privacidade Garantida e Contato Direto</h4>
            <p>
              O Portal TV Viamão não armazena currículos nem dados pessoais de candidatos.
              Ao se candidatar, você é encaminhado diretamente ao canal oficial indicado pela empresa.
            </p>
          </div>
        </div>
        <div className="footer-banner-cta">
          <ButtonLink href="/empregos/publicar" variant="secondary">
            É empregador? Cadastre uma vaga grátis ↗
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
