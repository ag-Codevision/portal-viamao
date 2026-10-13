import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Banknote,
  Calendar,
  Sparkles,
  CheckCircle2,
  Building2,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { getJob, getCompany } from "@/lib/data";
import { localDate } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return {
    title: (await getJob((await params).slug))?.title ?? "Vaga não encontrada",
  };
}

export default async function Job({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const j = await getJob((await params).slug);
  if (!j) notFound();
  const c = await getCompany(j.companyId);
  const companyName = j.companyName ?? c?.name ?? "Empresa Local";

  return (
    <article className="container page-content reading">
      <Link href="/empregos" className="back-link-action">
        <ArrowLeft size={16} /> Voltar para o Balcão de Vagas
      </Link>

      <div className="job-detail-header-card">
        <div className="job-detail-top">
          <span className="eyebrow-badge">
            <Sparkles size={12} aria-hidden="true" />
            {j.area.toUpperCase()} · VIAMÃO/RS
          </span>
          <span className="job-badge-pill">
            <span className="status-dot-pulse" aria-hidden="true" />
            Demonstração Comunitária
          </span>
        </div>

        <h1 className="job-detail-main-title">{j.title}</h1>

        <div className="job-detail-meta-row">
          <div className="meta-item">
            <Building2 size={16} className="text-amber" aria-hidden="true" />
            <strong>{companyName}</strong>
          </div>
          <div className="meta-item">
            <MapPin size={16} className="text-amber" aria-hidden="true" />
            <span>{j.locationText}</span>
          </div>
          <div className="meta-item">
            <Calendar size={16} className="text-muted" aria-hidden="true" />
            <span>Prazo: {localDate(j.expiresAt)}</span>
          </div>
        </div>

        {j.salary && (
          <div className="job-salary-banner">
            <Banknote size={18} aria-hidden="true" />
            <div>
              <span className="salary-label">Remuneração informada:</span>
              <strong className="salary-amount">{j.salary}</strong>
            </div>
          </div>
        )}

        <div className="job-chips detail-chips">
          <span className="job-chip chip-workmode">{j.workMode}</span>
          <span className="job-chip chip-type">{j.employmentType}</span>
          <span className="job-chip chip-verified">{j.area}</span>
        </div>
      </div>

      <div className="job-detail-section">
        <h2>Sobre a Oportunidade</h2>
        <p className="job-description-text">{j.description}</p>
      </div>

      <div className="job-detail-section">
        <h2>Requisitos e Perfil Desejado</h2>
        <ul className="job-requirements-list">
          {j.requirements.map((r) => (
            <li key={r}>
              <CheckCircle2 size={16} className="req-check-icon" aria-hidden="true" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="job-candidacy-box">
        <div className="candidacy-header">
          <ShieldCheck size={24} className="candidacy-shield-icon" aria-hidden="true" />
          <div>
            <strong>Candidatura 100% Direta e Externa</strong>
            <p>
              O Portal TV Viamão conecta a comunidade sem intermediários. Não armazenamos currículos
              nem coletamos dados sensíveis de candidatos.
            </p>
          </div>
        </div>

        <div className="candidacy-actions">
          <button type="button" className="button button-primary" disabled>
            <ExternalLink size={16} /> Candidatar-se na Empresa (Demonstração)
          </button>
          <ButtonLink href="/empregos" variant="secondary">
            Ver outras vagas em Viamão
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

export const dynamicParams = false;
export async function generateStaticParams() {
  const { listJobs } = await import("@/lib/data");
  return (await listJobs()).map((j) => ({ slug: j.slug }));
}
