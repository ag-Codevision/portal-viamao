import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  XCircle,
  Pause,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import { jobsStore } from "@/lib/data";

export const metadata = { title: "Moderação de Vagas · Admin Portal TV Viamão" };

export default async function AdminJobsModerationPage() {
  const allJobs = await jobsStore.listAllJobsForAdmin();
  const companies = await jobsStore.listCompanies();

  const totalApplications = allJobs.reduce(
    (acc, j) => acc + (j.applicationsCount || 0),
    0
  );

  return (
    <div className="container page-content admin-moderation-page">
      <div className="admin-header-card">
        <span className="eyebrow-badge">
          <ShieldCheck size={13} aria-hidden="true" />
          PAINEL DE MODERAÇÃO ADMINISTRATIVA · EQUIPE EDITORIAL
        </span>
        <h1>Governança e Moderação de Vagas</h1>
        <p className="page-intro">
          Supervisão de oportunidades publicadas por empresas anunciantes e assinantes do Portal TV Viamão.
          Garante a veracidade das informações, cumprimento das diretrizes comunitárias e proteção contra golpes.
        </p>
      </div>

      {/* METRICAS GLOBAIS DE EMPREGOS */}
      <div className="admin-metrics-row">
        <div className="admin-metric-card">
          <span className="metric-val">{companies.length}</span>
          <span className="metric-desc">Empresas Autorizadas</span>
        </div>
        <div className="admin-metric-card">
          <span className="metric-val">{allJobs.length}</span>
          <span className="metric-desc">Oportunidades Cadastradas</span>
        </div>
        <div className="admin-metric-card">
          <span className="metric-val">
            {allJobs.filter((j) => j.status === "published").length}
          </span>
          <span className="metric-desc">Vagas Ativas no Portal</span>
        </div>
        <div className="admin-metric-card">
          <span className="metric-val">{totalApplications}</span>
          <span className="metric-desc">Candidaturas Processadas</span>
        </div>
      </div>

      {/* TABELA DE MODERAÇÃO DE VAGAS */}
      <section className="admin-table-section">
        <div className="table-header-wrap">
          <h2>Todas as Vagas no Sistema</h2>
          <span className="text-muted text-sm">
            Auditoria em tempo real das empresas locais.
          </span>
        </div>

        <div className="admin-table-container">
          <table className="admin-moderation-table">
            <thead>
              <tr>
                <th>Vaga / Cargo</th>
                <th>Empresa Anunciante</th>
                <th>Regime / Turno</th>
                <th>Status Atual</th>
                <th>Inscritos</th>
                <th>Ações de Moderação</th>
              </tr>
            </thead>
            <tbody>
              {allJobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <strong>{job.title}</strong>
                    <div className="text-xs text-muted">{job.locationText}</div>
                  </td>
                  <td>
                    <span className="company-tag">
                      <Building2 size={13} className="text-amber" /> {job.companyName}
                    </span>
                  </td>
                  <td>
                    {job.employmentType} • {job.workMode} {job.shift ? `(${job.shift})` : ""}
                  </td>
                  <td>
                    {job.status === "published" ? (
                      <span className="status-pill status-active">Publicada</span>
                    ) : job.status === "filled" ? (
                      <span className="status-pill status-filled">Preenchida</span>
                    ) : job.status === "paused" ? (
                      <span className="status-pill status-paused">Pausada</span>
                    ) : (
                      <span className="status-pill status-review">{job.status}</span>
                    )}
                  </td>
                  <td>
                    <span className="applications-count-badge">
                      <Users size={12} /> {job.applicationsCount || 0}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions-cell">
                      <Link
                        href={`/empregos/${job.slug}`}
                        className="button button-secondary-compact"
                        target="_blank"
                      >
                        Visualizar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* DIRETRIZES DE MODERAÇÃO E LGPD */}
      <div className="admin-governance-card">
        <div className="gov-header">
          <AlertTriangle size={18} className="text-amber" />
          <strong>Diretrizes de Moderação Comunitária & Segurança LGPD</strong>
        </div>
        <p>
          1. <strong>Prevenção de Fraudes</strong>: Não são permitidas vagas que exijam pagamento de taxas para participação em processos seletivos ou compra de treinamentos.<br />
          2. <strong>Privacidade de Mídia</strong>: Vídeos de pitch e currículos são documentos privados, acessados estritamente pela empresa anunciante e protegidos por tokens de sessão.
        </p>
      </div>
    </div>
  );
}
