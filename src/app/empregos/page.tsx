import Link from "next/link";
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Send,
  Search,
  Briefcase,
  Building2,
  Users,
  Clock,
  Video,
  ChevronDown,
  Filter,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { listJobs } from "@/lib/data";
import { JobCard } from "@/components/jobs/job-card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";
import type { JobStatus } from "@/types";

export const metadata = { title: "Trabalhe Conosco · Portal TV Viamão" };

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    area?: string;
    modalidade?: string;
    vinculo?: string;
    turno?: string;
    status?: string;
  }>;
}) {
  const p = await searchParams;

  const jobs = await listJobs({
    query: p.q,
    area: p.area,
    workMode: p.modalidade,
    employmentType: p.vinculo,
    shift: p.turno,
    status: (p.status as JobStatus) || undefined,
    citySlug: "viamao",
  });

  const activeFilter =
    p.area || p.modalidade || p.vinculo || p.turno || p.status || (p.q ? `Busca: "${p.q}"` : null);

  const openCount = jobs.filter((j) => j.status === "published").length;

  return (
    <div className="container page-content jobs-page">
      {/* Hero da Página de Trabalhe Conosco */}
      <section className="jobs-hero-card">
        <div className="jobs-hero-content">
          <span className="eyebrow-badge">
            <Sparkles size={13} aria-hidden="true" />
            MÓDULO TRABALHE CONOSCO · PORTAL TV VIAMÃO
          </span>
          <h1>
            Conectando talentos às empresas de{" "}
            <span className="brand-highlight">Viamão e Região</span>.
          </h1>
          <p className="page-intro">
            Publique vagas, envie currículos e apresente seu diferencial com vídeos curtos de pitch.
            Um ecossistema ágil, transparente e sem intermediários para fortalecer o mercado local.
          </p>

          <div className="jobs-hero-actions">
            <ButtonLink href="/empresas/vagas" variant="default">
              <Building2 size={16} /> Painel das Empresas ↗
            </ButtonLink>
            <ButtonLink href="/candidato/minhas-candidaturas" variant="secondary">
              <Users size={16} /> Acompanhar Minhas Candidaturas
            </ButtonLink>
          </div>
        </div>

        {/* Pilares do Módulo Trabalhe Conosco */}
        <div className="jobs-metrics-grid">
          <div className="metric-box">
            <div className="metric-icon-wrap" aria-hidden="true">
              <Building2 size={20} />
            </div>
            <div>
              <strong>Empresas Locais</strong>
              <p>Oportunidades no Centro, Santa Isabel, Viamópolis e Itapuã.</p>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap" aria-hidden="true">
              <Video size={20} />
            </div>
            <div>
              <strong>Vídeo de Pitch (120s)</strong>
              <p>Mostre seu perfil e energia em vídeos curtos e seguros.</p>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon-wrap" aria-hidden="true">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <strong>Feedback Transparente</strong>
              <p>Acompanhe cada etapa da sua inscrição em tempo real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Busca e Filtros Redesenhada com Alta Usabilidade */}
      <section className="jobs-filter-panel" id="vagas-list">
        <div className="filter-panel-header">
          <div>
            <h2 className="filter-title">Explorar Oportunidades de Emprego</h2>
            <p className="filter-subtitle">
              Filtre por cargo, empresa, bairro ou selecione critérios específicos de contratação.
            </p>
          </div>
          {activeFilter && (
            <Link href="/empregos" className="clear-filters-link" title="Limpar todos os filtros">
              <X size={14} /> Limpar filtros
            </Link>
          )}
        </div>

        <form className="jobs-filter-form-v2" action="/empregos">
          {/* Barra de Pesquisa Ampla */}
          <div className="search-bar-row">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" aria-hidden="true" />
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={p.q}
                placeholder="Busque por cargo, palavra-chave, bairro (Centro, Santa Isabel, Viamópolis) ou empresa..."
                aria-label="Buscar vaga por cargo, bairro ou empresa"
              />
            </div>
            <button type="submit" className="search-submit-btn">
              <Search size={16} /> Buscar
            </button>
          </div>

          {/* Grid de Seletores com Rótulos Claros e Legibilidade Impecável */}
          <div className="filter-selectors-grid">
            {/* Campo 1: Área */}
            <div className="filter-field-group">
              <label htmlFor="area" className="filter-field-label">
                Área de Atuação
              </label>
              <div className="select-control-box">
                <select id="area" name="area" defaultValue={p.area ?? ""}>
                  <option value="">Todas as áreas</option>
                  <option value="Comércio">Comércio e Varejo</option>
                  <option value="Administrativo">Administrativo / Financeiro</option>
                  <option value="Logística">Logística e Estoque</option>
                  <option value="Alimentação">Alimentação e Gastronomia</option>
                  <option value="Serviços Gerais">Serviços Gerais</option>
                </select>
                <ChevronDown size={15} className="select-arrow-icon" aria-hidden="true" />
              </div>
            </div>

            {/* Campo 2: Modalidade */}
            <div className="filter-field-group">
              <label htmlFor="modalidade" className="filter-field-label">
                Modalidade
              </label>
              <div className="select-control-box">
                <select id="modalidade" name="modalidade" defaultValue={p.modalidade ?? ""}>
                  <option value="">Todas as modalidades</option>
                  <option value="Presencial">Presencial em Viamão</option>
                  <option value="Híbrido">Modelo Híbrido</option>
                  <option value="Remoto">100% Remoto</option>
                </select>
                <ChevronDown size={15} className="select-arrow-icon" aria-hidden="true" />
              </div>
            </div>

            {/* Campo 3: Regime de Contratação */}
            <div className="filter-field-group">
              <label htmlFor="vinculo" className="filter-field-label">
                Regime de Vínculo
              </label>
              <div className="select-control-box">
                <select id="vinculo" name="vinculo" defaultValue={p.vinculo ?? ""}>
                  <option value="">Todos os regimes</option>
                  <option value="CLT">CLT (Carteira assinada)</option>
                  <option value="PJ">Pessoa Jurídica (PJ)</option>
                  <option value="MEI">MEI / Prestador</option>
                  <option value="Estágio">Estágio Estudantil</option>
                </select>
                <ChevronDown size={15} className="select-arrow-icon" aria-hidden="true" />
              </div>
            </div>

            {/* Campo 4: Turno */}
            <div className="filter-field-group">
              <label htmlFor="turno" className="filter-field-label">
                Turno de Trabalho
              </label>
              <div className="select-control-box">
                <select id="turno" name="turno" defaultValue={p.turno ?? ""}>
                  <option value="">Todos os turnos</option>
                  <option value="Integral">Integral / Comercial</option>
                  <option value="Manhã">Turno Manhã</option>
                  <option value="Tarde">Turno Tarde</option>
                  <option value="Noite">Turno Noite</option>
                  <option value="Escala">Escala (12x36 / 6x1)</option>
                </select>
                <ChevronDown size={15} className="select-arrow-icon" aria-hidden="true" />
              </div>
            </div>

            {/* Campo 5: Situação / Status */}
            <div className="filter-field-group">
              <label htmlFor="status" className="filter-field-label">
                Situação da Vaga
              </label>
              <div className="select-control-box">
                <select id="status" name="status" defaultValue={p.status ?? ""}>
                  <option value="">Todas as situações</option>
                  <option value="published">Apenas Inscrições Abertas</option>
                  <option value="filled">Vagas Preenchidas</option>
                </select>
                <ChevronDown size={15} className="select-arrow-icon" aria-hidden="true" />
              </div>
            </div>

            {/* Botão de Aplicação dos Filtros */}
            <div className="filter-action-group">
              <button type="submit" className="filter-apply-btn-v2">
                <SlidersHorizontal size={16} /> Aplicar Filtros
              </button>
            </div>
          </div>

          {/* Atalhos Rápidos com Pílulas Clicáveis */}
          <div className="quick-filter-pills-row">
            <span className="pills-title">Filtros rápidos:</span>
            <Link
              href="/empregos"
              className={`filter-quick-pill ${!activeFilter ? "active" : ""}`}
            >
              Todas as Vagas
            </Link>
            <Link
              href="/empregos?status=published"
              className={`filter-quick-pill ${p.status === "published" ? "active" : ""}`}
            >
              ● Inscrições Abertas
            </Link>
            <Link
              href="/empregos?area=Comércio"
              className={`filter-quick-pill ${p.area === "Comércio" ? "active" : ""}`}
            >
              Comércio
            </Link>
            <Link
              href="/empregos?area=Administrativo"
              className={`filter-quick-pill ${p.area === "Administrativo" ? "active" : ""}`}
            >
              Administrativo
            </Link>
            <Link
              href="/empregos?area=Logística"
              className={`filter-quick-pill ${p.area === "Logística" ? "active" : ""}`}
            >
              Logística
            </Link>
            <Link
              href="/empregos?modalidade=Presencial"
              className={`filter-quick-pill ${p.modalidade === "Presencial" ? "active" : ""}`}
            >
              Presencial
            </Link>
            <Link
              href="/empregos?modalidade=Híbrido"
              className={`filter-quick-pill ${p.modalidade === "Híbrido" ? "active" : ""}`}
            >
              Híbrido
            </Link>
            <Link
              href="/empregos?vinculo=CLT"
              className={`filter-quick-pill ${p.vinculo === "CLT" ? "active" : ""}`}
            >
              CLT
            </Link>
          </div>
        </form>

        {/* Barra de Status e Contagem de Resultados */}
        <div className="filter-results-bar">
          <div className="results-count">
            Exibindo <strong>{jobs.length}</strong> {jobs.length === 1 ? "oportunidade" : "oportunidades"} em Viamão ({openCount} com inscrições abertas)
          </div>
          {activeFilter && (
            <div className="active-tag-pill">
              Filtro ativo: {activeFilter}
            </div>
          )}
        </div>
      </section>

      {/* Grid de Vagas — Cards Lado a Lado no Desktop */}
      <section className="jobs-main-grid" aria-label="Lista de vagas disponíveis">
        {jobs.length === 0 ? (
          <EmptyState
            title="Nenhuma oportunidade encontrada"
            description="Tente ajustar os filtros ou pesquisar com termos mais amplos."
            href="/empregos"
            action="Limpar todos os filtros"
          />
        ) : (
          <div className="jobs-cards-grid">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
