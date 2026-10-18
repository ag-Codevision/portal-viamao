"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  Briefcase,
  Video,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import type { JobApplication } from "@/types";
import { jobsStore } from "@/lib/data/jobs-mock-store";

function getStatusBadge(status: string) {
  switch (status) {
    case "submitted":
      return { label: "Enviada / Aguardando Triagem", className: "status-submitted" };
    case "under_review":
      return { label: "Em Análise pela Empresa", className: "status-review" };
    case "interview":
      return { label: "Entrevista Agendada", className: "status-interview" };
    case "approved":
      return { label: "Candidatura Aprovada", className: "status-approved" };
    case "rejected":
      return { label: "Não Selecionado nesta Etapa", className: "status-rejected" };
    default:
      return { label: status, className: "status-default" };
  }
}

function CandidateApplicationsContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [searchedEmail, setSearchedEmail] = useState(initialEmail);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      handleSearch(initialEmail);
    }
  }, [initialEmail]);

  async function handleSearch(targetEmail: string) {
    if (!targetEmail.trim()) return;
    setLoading(true);
    setSearchedEmail(targetEmail);
    try {
      const results = await jobsStore.listCandidateApplications(targetEmail);
      setApplications(results);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSearch(email);
  }

  return (
    <>
      <div className="candidate-hero-card">
        <span className="eyebrow-badge">
          <Sparkles size={13} aria-hidden="true" />
          PORTAL DO CANDIDATO · ÁREA DE ACOMPANHAMENTO
        </span>
        <h1>Minhas Candidaturas</h1>
        <p className="page-intro">
          Consulte o andamento dos seus processos seletivos em empresas de Viamão.
          Informe seu e-mail cadastrado para visualizar suas inscrições e retornos da equipe de seleção.
        </p>

        <form className="candidate-search-form" onSubmit={onSubmit}>
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" aria-hidden="true" />
            <input
              type="email"
              required
              placeholder="Digite o e-mail utilizado na sua candidatura..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="E-mail da candidatura"
            />
          </div>
          <button type="submit" className="button button-primary" disabled={loading}>
            {loading ? "Consultando..." : "Buscar Minhas Vagas"}
          </button>
        </form>

        <div className="quick-demo-emails">
          <span>Exemplos para demonstração rápida:</span>
          <button
            type="button"
            className="demo-email-btn"
            onClick={() => {
              setEmail("juliana.silveira.rs@gmail.com");
              handleSearch("juliana.silveira.rs@gmail.com");
            }}
          >
            Juliana (juliana.silveira.rs@gmail.com)
          </button>
          <button
            type="button"
            className="demo-email-btn"
            onClick={() => {
              setEmail("mariana.becker.adm@gmail.com");
              handleSearch("mariana.becker.adm@gmail.com");
            }}
          >
            Mariana (mariana.becker.adm@gmail.com)
          </button>
        </div>
      </div>

      {/* RESULTADOS DA CONSULTA */}
      {hasSearched && (
        <section className="applications-results-section" aria-label="Histórico de candidaturas">
          <div className="results-header">
            <h2>
              Inscrições vinculadas a <em>{searchedEmail}</em>
            </h2>
            <span className="badge-total-count">
              {applications.length} {applications.length === 1 ? "candidatura encontrada" : "candidaturas encontradas"}
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="empty-results-box">
              <AlertCircle size={32} className="text-muted" />
              <h3>Nenhuma candidatura localizada com este e-mail</h3>
              <p>
                Verifique se o e-mail digitado é exatamente o mesmo utilizado no formulário da vaga ou explore novas oportunidades abertas.
              </p>
              <Link href="/empregos" className="button button-primary mt-3">
                Ver Vagas Abertas em Viamão
              </Link>
            </div>
          ) : (
            <div className="candidate-applications-list">
              {applications.map((app) => {
                const statusBadge = getStatusBadge(app.status);
                return (
                  <div key={app.id} className="candidate-app-card">
                    <div className="card-top-header">
                      <div>
                        <span className="app-company">
                          <Building2 size={14} className="text-amber" /> {app.companyName}
                        </span>
                        <h3 className="app-job-title">{app.jobTitle}</h3>
                      </div>
                      <span className={`status-pill ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <div className="app-meta-row">
                      <span className="meta-info">
                        <Clock size={14} /> Enviada em:{" "}
                        {new Date(app.appliedAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="meta-protocol">Protocolo: {app.id}</span>
                    </div>

                    <div className="app-materials-summary">
                      {app.videoPitchUrl ? (
                        <span className="material-badge active">
                          <Video size={14} /> Vídeo Pitch Anexado ({app.videoPitchDuration}s)
                        </span>
                      ) : (
                        <span className="material-badge disabled">
                          <Video size={14} /> Sem vídeo pitch
                        </span>
                      )}

                      {app.resumeName ? (
                        <span className="material-badge active">
                          <FileText size={14} /> Currículo ({app.resumeName})
                        </span>
                      ) : (
                        <span className="material-badge disabled">
                          <FileText size={14} /> Sem currículo
                        </span>
                      )}
                    </div>

                    {app.status === "interview" && (
                      <div className="interview-notice-box">
                        <CheckCircle2 size={18} className="text-success" />
                        <div>
                          <strong>Parabéns! Sua candidatura avançou para a fase de Entrevista.</strong>
                          <p>A equipe de RH da {app.companyName} entrará em contato via telefone ou WhatsApp informado.</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </>
  );
}

export default function CandidateApplicationsPage() {
  return (
    <div className="container page-content candidate-page">
      <Suspense fallback={<div className="loading-state">Carregando painel do candidato...</div>}>
        <CandidateApplicationsContent />
      </Suspense>
    </div>
  );
}
