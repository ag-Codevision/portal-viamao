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
  Clock,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
  Video,
  Send,
} from "lucide-react";
import { getJob, getCompany } from "@/lib/data";
import { localDate } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const j = await getJob(slug);
  return {
    title: j ? `${j.title} · ${j.companyName} · Viamão` : "Vaga não encontrada",
  };
}

export default async function JobDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const j = await getJob(slug);
  if (!j) notFound();

  const c = await getCompany(j.companyId);
  const companyName = j.companyName ?? c?.name ?? "Empresa Local";
  const isFilled = j.status === "filled";
  const isPaused = j.status === "paused";

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

          {isFilled ? (
            <span className="job-badge-pill badge-filled">
              <span className="status-dot-filled" aria-hidden="true" />
              Vaga Preenchida
            </span>
          ) : isPaused ? (
            <span className="job-badge-pill badge-paused">
              <span className="status-dot-paused" aria-hidden="true" />
              Inscrições Pausadas
            </span>
          ) : (
            <span className="job-badge-pill badge-active">
              <span className="status-dot-pulse" aria-hidden="true" />
              Inscrições Abertas
            </span>
          )}
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
          {j.shift && (
            <div className="meta-item">
              <Clock size={16} className="text-amber" aria-hidden="true" />
              <span>Turno: {j.shift}</span>
            </div>
          )}
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

      {/* AVISO QUANDO A VAGA JÁ ESTIVER PREENCHIDA OU PAUSADA */}
      {isFilled && (
        <div className="job-closed-callout" role="alert">
          <AlertCircle size={22} className="text-danger" />
          <div>
            <strong>Processo Seletivo Encerrado</strong>
            <p>
              Esta vaga foi marcada como <strong>Preenchida</strong> pela empresa contratante. Não são mais
              aceitas novas candidaturas para esta posição.
            </p>
          </div>
        </div>
      )}

      {/* DESCRIÇÃO DA VAGA */}
      <div className="job-detail-section">
        <h2>Sobre a Oportunidade</h2>
        <p className="job-description-text">{j.description}</p>
      </div>

      {/* REQUISITOS */}
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

      {/* BENEFÍCIOS */}
      {j.benefits && j.benefits.length > 0 && (
        <div className="job-detail-section">
          <h2>Benefícios Oferecidos</h2>
          <ul className="job-benefits-list">
            {j.benefits.map((b) => (
              <li key={b} className="benefit-badge-item">
                <Sparkles size={14} className="text-amber" /> {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* PERGUNTAS ESPECÍFICAS DA VAGA (AVISO AO CANDIDATO) */}
      {j.questions && j.questions.length > 0 && (
        <div className="job-detail-section">
          <h2>
            <HelpCircle size={18} className="text-amber" /> Perguntas da Seleção
          </h2>
          <p className="text-muted">
            Ao se candidatar, você responderá às seguintes perguntas formuladas pela empresa:
          </p>
          <ul className="job-questions-preview-list">
            {j.questions.map((q, idx) => (
              <li key={q.id}>
                <strong>{idx + 1}. {q.prompt}</strong>
                {q.required && <span className="req-tag">Obrigatória</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* BLOCO DE CANDIDATURA E CTA */}
      <div className="job-candidacy-box">
        <div className="candidacy-header">
          <ShieldCheck size={24} className="candidacy-shield-icon" aria-hidden="true" />
          <div>
            <strong>Candidatura Direta e Conectada</strong>
            <p>
              Envie seus dados, anexe seu currículo e envie um pitch em vídeo de até 2 minutos para se destacar.
              Seus dados serão enviados de forma segura e privada para <strong>{companyName}</strong>.
            </p>
          </div>
        </div>

        <div className="candidacy-actions">
          {isFilled ? (
            <button type="button" className="button button-secondary" disabled>
              Vaga Preenchida — Inscrições Encerradas
            </button>
          ) : isPaused ? (
            <button type="button" className="button button-secondary" disabled>
              Vaga Pausada Temporariamente
            </button>
          ) : (
            <ButtonLink href={`/empregos/${j.slug}/candidatar`} variant="default">
              <Send size={16} /> Candidatar-se a esta vaga ↗
            </ButtonLink>
          )}

          <ButtonLink href="/empregos" variant="secondary">
            Ver outras vagas em Viamão
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
