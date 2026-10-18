import Link from "next/link";
import {
  Building2,
  Plus,
  Users,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Clock,
  Sparkles,
  MapPin,
  Pause,
  Play,
  Check,
} from "lucide-react";
import { jobsStore } from "@/lib/data";
import { CompanySwitcher } from "@/components/jobs/company-switcher";
import { localDate } from "@/lib/utils";
import type { JobStatus } from "@/types";

export const metadata = { title: "Painel da Empresa · Portal TV Viamão" };

export default async function CompanyJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const p = await searchParams;
  const companies = await jobsStore.listCompanies();
  const currentCompanyId = p.companyId || companies[0]?.id || "company-0";

  const company = (await jobsStore.getCompany(currentCompanyId)) || companies[0];
  const companyJobs = await jobsStore.listCompanyJobs(currentCompanyId);

  const totalApplications = companyJobs.reduce(
    (acc, j) => acc + (j.applicationsCount || 0),
    0
  );
  const activeJobs = companyJobs.filter((j) => j.status === "published").length;
  const filledJobs = companyJobs.filter((j) => j.status === "filled").length;

  return (
    <div className="container page-content company-portal-wrapper">
      <div className="company-portal-top-bar">
        <div>
          <span className="eyebrow-badge">
            <Sparkles size={12} aria-hidden="true" /> ÁREA DA EMPRESA · GESTÃO DE OPORTUNIDADES
          </span>
          <h1>Painel de Vagas & Recrutamento</h1>
          <p className="page-intro">
            Administre as oportunidades da sua empresa em Viamão, publique novas vagas e acerte a triagem dos candidatos com vídeo pitch.
          </p>
        </div>

        <Link
          href={`/empresas/vagas/nova?companyId=${currentCompanyId}`}
          className="button button-primary button-lg"
        >
          <Plus size={18} /> Publicar Nova Vaga
        </Link>
      </div>

      {/* SELETOR MULTI-TENANT */}
      <CompanySwitcher
        companies={companies}
        selectedCompanyId={currentCompanyId}
      />

      {/* CARDS DE MÉTRICAS OPERACIONAIS */}
      <div className="company-kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrap" aria-hidden="true">
            <Briefcase size={22} className="text-amber" />
          </div>
          <div>
            <span className="kpi-value">{activeJobs}</span>
            <span className="kpi-label">Vagas Ativas (Recebendo Inscrições)</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" aria-hidden="true">
            <Users size={22} className="text-amber" />
          </div>
          <div>
            <span className="kpi-value">{totalApplications}</span>
            <span className="kpi-label">Candidatos Inscritos</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrap" aria-hidden="true">
            <CheckCircle2 size={22} className="text-success" />
          </div>
          <div>
            <span className="kpi-value">{filledJobs}</span>
            <span className="kpi-label">Vagas Concluídas / Preenchidas</span>
          </div>
        </div>
      </div>

      {/* LISTAGEM DE VAGAS DA EMPRESA */}
      <section className="company-jobs-section" aria-label="Oportunidades cadastradas">
        <div className="section-header-row">
          <h2>Oportunidades Cadastradas ({companyJobs.length})</h2>
          <span className="text-muted text-sm">
            Os dados e candidaturas abaixo são isolados e visíveis apenas para <strong>{company.name}</strong>.
          </span>
        </div>

        {companyJobs.length === 0 ? (
          <div className="empty-state-box">
            <Briefcase size={40} className="text-muted" />
            <h3>Nenhuma vaga cadastrada ainda</h3>
            <p>Comece publicando sua primeira oportunidade para receber candidaturas e vídeos de apresentação.</p>
            <Link
              href={`/empresas/vagas/nova?companyId=${currentCompanyId}`}
              className="button button-primary mt-3"
            >
              <Plus size={16} /> Cadastrar Primeira Vaga
            </Link>
          </div>
        ) : (
          <div className="company-jobs-table-wrap">
            <div className="company-jobs-list">
              {companyJobs.map((job) => {
                const isFilled = job.status === "filled";
                const isPaused = job.status === "paused";

                return (
                  <div key={job.id} className="company-job-row-card">
                    <div className="job-info-main">
                      <div className="job-title-row">
                        <h3>{job.title}</h3>
                        {isFilled ? (
                          <span className="status-pill status-filled">
                            ● Preenchida
                          </span>
                        ) : isPaused ? (
                          <span className="status-pill status-paused">
                            ● Pausada
                          </span>
                        ) : (
                          <span className="status-pill status-active">
                            ● Ativa (Inscrições Abertas)
                          </span>
                        )}
                      </div>

                      <div className="job-meta-details">
                        <span>
                          <MapPin size={14} /> {job.locationText}
                        </span>
                        <span>
                          <Clock size={14} /> {job.workMode} • {job.employmentType} {job.shift ? `• ${job.shift}` : ""}
                        </span>
                        {job.salary && <span>💰 {job.salary}</span>}
                        <span>Expira em: {localDate(job.expiresAt)}</span>
                      </div>
                    </div>

                    <div className="job-stats-and-actions">
                      <Link
                        href={`/empresas/vagas/${job.id}/candidatos?companyId=${currentCompanyId}`}
                        className="candidates-badge-btn"
                        title="Ver funil de candidatos inscritos nesta vaga"
                      >
                        <Users size={16} />
                        <strong>{job.applicationsCount || 0}</strong>
                        <span>Candidatos</span>
                      </Link>

                      <div className="actions-button-row">
                        <Link
                          href={`/empregos/${job.slug}`}
                          className="button button-secondary-compact"
                          title="Visualizar vaga pública como candidato"
                          target="_blank"
                        >
                          <Eye size={14} /> Ver Pública ↗
                        </Link>

                        <Link
                          href={`/empresas/vagas/${job.id}/editar?companyId=${currentCompanyId}`}
                          className="button button-secondary-compact"
                          title="Editar informações da vaga"
                        >
                          <Edit size={14} /> Editar
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
