"use client";

import { useState } from "react";
import {
  Users,
  Video,
  FileText,
  Clock,
  Phone,
  Mail,
  Linkedin,
  Globe,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Eye,
  MessageSquare,
  Sparkles,
  Calendar,
} from "lucide-react";
import type { JobApplication, JobApplicationStatus } from "@/types";
import { jobsStore } from "@/lib/data/jobs-mock-store";

interface CompanyPipelineBoardProps {
  companyId: string;
  jobId: string;
  initialApplications: JobApplication[];
}

const statusColumns: { id: JobApplicationStatus; label: string; badgeClass: string }[] = [
  { id: "submitted", label: "Enviadas (Novas)", badgeClass: "status-submitted" },
  { id: "under_review", label: "Em Análise", badgeClass: "status-review" },
  { id: "interview", label: "Entrevistas", badgeClass: "status-interview" },
  { id: "approved", label: "Aprovados", badgeClass: "status-approved" },
  { id: "rejected", label: "Não Selecionados", badgeClass: "status-rejected" },
];

export function CompanyPipelineBoard({
  companyId,
  jobId,
  initialApplications,
}: CompanyPipelineBoardProps) {
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [recruiterNotes, setRecruiterNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  function openCandidateModal(app: JobApplication) {
    setSelectedApp(app);
    setRecruiterNotes(app.recruiterNotes || "");
  }

  async function handleStatusChange(newStatus: JobApplicationStatus) {
    if (!selectedApp) return;
    setUpdating(true);
    try {
      const updated = await jobsStore.updateApplicationStatus(
        companyId,
        selectedApp.id,
        newStatus,
        recruiterNotes
      );
      if (updated) {
        setApplications((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a))
        );
        setSelectedApp(updated);
      }
    } finally {
      setUpdating(false);
    }
  }

  async function handleSaveNotes() {
    if (!selectedApp) return;
    setUpdating(true);
    try {
      const updated = await jobsStore.updateApplicationStatus(
        companyId,
        selectedApp.id,
        selectedApp.status,
        recruiterNotes
      );
      if (updated) {
        setApplications((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a))
        );
        setSelectedApp(updated);
      }
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="pipeline-wrapper">
      <div className="pipeline-summary-bar">
        <div className="meta-left">
          <Users size={18} className="text-amber" />
          <span>
            Total de <strong>{applications.length}</strong> {applications.length === 1 ? "candidato inscrito" : "candidatos inscritos"}
          </span>
        </div>
      </div>

      {/* COLUNAS KANBAN / FUNIL DE SELEÇÃO */}
      <div className="pipeline-board">
        {statusColumns.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);
          return (
            <div key={col.id} className="pipeline-column">
              <div className={`col-header ${col.badgeClass}`}>
                <span className="col-title">{col.label}</span>
                <span className="col-count">{colApps.length}</span>
              </div>

              <div className="col-cards-list">
                {colApps.length === 0 ? (
                  <div className="empty-col-placeholder">Nenhum candidato nesta etapa</div>
                ) : (
                  colApps.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      className="candidate-card"
                      onClick={() => openCandidateModal(app)}
                      aria-label={`Ver perfil de ${app.candidateName}`}
                    >
                      <div className="card-top-row">
                        <strong className="cand-name">{app.candidateName}</strong>
                        <span className="cand-date">
                          {new Date(app.appliedAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>

                      <div className="cand-contact-preview">
                        <span>{app.candidatePhone}</span>
                      </div>

                      <div className="cand-materials-badges">
                        {app.videoPitchUrl && (
                          <span className="badge-pitch" title="Vídeo de Apresentação disponível">
                            <Video size={12} /> Vídeo Pitch ({app.videoPitchDuration}s)
                          </span>
                        )}
                        {app.resumeName && (
                          <span className="badge-cv" title="Currículo anexado">
                            <FileText size={12} /> CV
                          </span>
                        )}
                        {app.answers && app.answers.length > 0 && (
                          <span className="badge-answers" title="Perguntas respondidas">
                            <HelpCircle size={12} /> {app.answers.length} resp.
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DETALHADO DO CANDIDATO */}
      {selectedApp && (
        <div className="modal-backdrop" onClick={() => setSelectedApp(null)}>
          <div
            className="candidate-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cand-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow-badge">TRIAGEM DE CANDIDATURA</span>
                <h2 id="cand-modal-title">{selectedApp.candidateName}</h2>
                <div className="modal-contact-line">
                  <a href={`mailto:${selectedApp.candidateEmail}`} className="contact-link">
                    <Mail size={14} /> {selectedApp.candidateEmail}
                  </a>
                  <a href={`tel:${selectedApp.candidatePhone}`} className="contact-link">
                    <Phone size={14} /> {selectedApp.candidatePhone}
                  </a>
                  {selectedApp.linkedinUrl && (
                    <a
                      href={selectedApp.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      <Linkedin size={14} /> LinkedIn ↗
                    </a>
                  )}
                  {selectedApp.portfolioUrl && (
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      <Globe size={14} /> Portfólio ↗
                    </a>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setSelectedApp(null)}
                aria-label="Fechar detalhes do candidato"
              >
                ✕
              </button>
            </div>

            <div className="modal-body-scrollable">
              {/* ETAPA ATUAL / FUNIL */}
              <div className="status-selector-box">
                <span className="status-label">Etapa no Processo Seletivo:</span>
                <div className="status-button-group">
                  {statusColumns.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      disabled={updating}
                      className={`status-chip-btn ${selectedApp.status === col.id ? "active" : ""}`}
                      onClick={() => handleStatusChange(col.id)}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* VÍDEO PITCH DE APRESENTAÇÃO */}
              {selectedApp.videoPitchUrl ? (
                <div className="modal-video-section">
                  <h3>
                    <Video size={18} className="text-amber" /> Vídeo de Apresentação (Pitch Pessoal)
                  </h3>
                  <div className="video-player-container">
                    <video
                      src={selectedApp.videoPitchUrl}
                      controls
                      playsInline
                      className="pitch-video-element"
                      aria-label={`Vídeo de apresentação de ${selectedApp.candidateName}`}
                    />
                  </div>
                  <p className="video-privacy-footnote">
                    🔒 A reprodução deste vídeo é privada e restrita aos avaliadores da empresa. Não é compartilhado publicamente.
                  </p>
                </div>
              ) : (
                <div className="no-video-notice">
                  <span>O candidato optou por não enviar vídeo pitch (envio opcional).</span>
                </div>
              )}

              {/* RESUMO E MINI-BIO */}
              {selectedApp.bio && (
                <div className="modal-info-section">
                  <h3>Apresentação / Resumo Profissional</h3>
                  <p className="bio-paragraph">{selectedApp.bio}</p>
                </div>
              )}

              {/* RESPOSTAS ÀS PERGUNTAS */}
              {selectedApp.answers && selectedApp.answers.length > 0 && (
                <div className="modal-info-section">
                  <h3>
                    <HelpCircle size={18} className="text-amber" /> Respostas às Perguntas da Vaga
                  </h3>
                  <div className="answers-accordion">
                    {selectedApp.answers.map((ans, idx) => (
                      <div key={idx} className="answer-block">
                        <strong>
                          {idx + 1}. {ans.prompt}
                        </strong>
                        <p>{ans.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CURRÍCULO ANEXADO */}
              <div className="modal-info-section">
                <h3>
                  <FileText size={18} className="text-amber" /> Currículo Anexado
                </h3>
                {selectedApp.resumeName ? (
                  <div className="resume-download-card">
                    <div className="cv-icon-wrap">
                      <FileText size={24} />
                    </div>
                    <div>
                      <strong>{selectedApp.resumeName}</strong>
                      <p>Documento de apresentação profissional fornecido pelo candidato.</p>
                    </div>
                    <button
                      type="button"
                      className="button button-secondary-compact ml-auto"
                      onClick={() => alert(`Simulação: Baixando arquivo ${selectedApp.resumeName}`)}
                    >
                      Baixar Arquivo
                    </button>
                  </div>
                ) : (
                  <p className="text-muted">Nenhum documento anexado.</p>
                )}
              </div>

              {/* ANOTAÇÕES DO RECRUTADOR */}
              <div className="modal-info-section">
                <h3>
                  <MessageSquare size={18} className="text-amber" /> Anotações Internas do Recrutador (Privado)
                </h3>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Registre impressões, data da entrevista ou parecer técnico sobre o candidato..."
                  value={recruiterNotes}
                  onChange={(e) => setRecruiterNotes(e.target.value)}
                />
                <button
                  type="button"
                  className="button button-primary-compact mt-2"
                  disabled={updating}
                  onClick={handleSaveNotes}
                >
                  {updating ? "Salvando..." : "Salvar Anotações"}
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setSelectedApp(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
