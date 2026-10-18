import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Building2,
  Users,
  ShieldAlert,
  CheckCircle2,
  Pause,
  Play,
  Eye,
  MapPin,
  Clock,
} from "lucide-react";
import { jobsStore } from "@/lib/data";
import { CompanyPipelineBoard } from "@/components/jobs/company-pipeline-board";

export const metadata = { title: "Funil de Candidatos · Portal TV Viamão" };

export default async function JobCandidatesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ companyId?: string }>;
}) {
  const { id } = await params;
  const p = await searchParams;

  const job = await jobsStore.getJobById(id);
  if (!job) notFound();

  const companies = await jobsStore.listCompanies();
  const currentCompanyId = p.companyId || job.companyId || companies[0]?.id;
  const company = (await jobsStore.getCompany(currentCompanyId)) || companies[0];

  // ISOLAMENTO MULTI-TENANT: A vaga deve pertencer à empresa da sessão
  if (job.companyId !== currentCompanyId) {
    return (
      <div className="container page-content">
        <div className="unauthorized-access-box" role="alert">
          <ShieldAlert size={40} className="text-danger" />
          <h2>Acesso Não Autorizado (Isolamento Multi-tenant)</h2>
          <p>
            Esta oportunidade pertence a outra empresa cadastrada na plataforma. Cada empresa assinante
            só pode acessar e gerenciar candidaturas das suas próprias vagas.
          </p>
          <Link
            href={`/empresas/vagas?companyId=${currentCompanyId}`}
            className="button button-primary mt-3"
          >
            Voltar para as vagas de {company.name}
          </Link>
        </div>
      </div>
    );
  }

  const applications = await jobsStore.listJobApplications(currentCompanyId, job.id);

  return (
    <div className="container page-content pipeline-page-wrapper">
      <Link
        href={`/empresas/vagas?companyId=${currentCompanyId}`}
        className="back-link-action"
      >
        <ArrowLeft size={16} /> Voltar para o Painel de Vagas
      </Link>

      <div className="pipeline-header-card">
        <div className="pipeline-header-top">
          <span className="eyebrow-badge">
            <Sparkles size={12} aria-hidden="true" />
            TRIAGEM E RECRUTAMENTO · {company.name.toUpperCase()}
          </span>

          <div className="pipeline-header-badges">
            {job.status === "filled" ? (
              <span className="job-badge-pill badge-filled">● Vaga Preenchida</span>
            ) : job.status === "paused" ? (
              <span className="job-badge-pill badge-paused">● Inscrições Pausadas</span>
            ) : (
              <span className="job-badge-pill badge-active">● Inscrições Abertas</span>
            )}
          </div>
        </div>

        <div className="pipeline-title-row">
          <div>
            <h1>{job.title}</h1>
            <div className="pipeline-job-meta">
              <span>
                <MapPin size={14} /> {job.locationText}
              </span>
              <span>
                <Clock size={14} /> {job.workMode} • {job.employmentType} {job.shift ? `• ${job.shift}` : ""}
              </span>
              {job.salary && <span>💰 {job.salary}</span>}
            </div>
          </div>

          <div className="pipeline-header-actions">
            <Link
              href={`/empregos/${job.slug}`}
              className="button button-secondary-compact"
              target="_blank"
            >
              <Eye size={14} /> Ver Vaga Pública ↗
            </Link>
          </div>
        </div>
      </div>

      {/* FUNIL KANBAN DE CANDIDATOS */}
      <CompanyPipelineBoard
        companyId={currentCompanyId}
        jobId={job.id}
        initialApplications={applications}
      />
    </div>
  );
}
