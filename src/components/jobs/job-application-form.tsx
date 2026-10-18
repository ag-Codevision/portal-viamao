"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  Linkedin,
  Globe,
  ShieldCheck,
  Building2,
  ArrowRight,
  UploadCloud,
} from "lucide-react";
import type { Job, JobQuestion } from "@/types";
import { VideoPitchRecorder } from "./video-pitch-recorder";
import { jobsStore } from "@/lib/data/jobs-mock-store";

interface JobApplicationFormProps {
  job: Job;
}

export function JobApplicationForm({ job }: JobApplicationFormProps) {
  const [formData, setFormData] = useState({
    candidateName: "",
    candidateEmail: "",
    candidatePhone: "",
    linkedinUrl: "",
    portfolioUrl: "",
    bio: "",
    consentLgpd: false,
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [videoData, setVideoData] = useState<{
    url: string;
    duration: number;
    size: number;
    fileName?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successProtocol, setSuccessProtocol] = useState<string | null>(null);

  const isFilled = job.status === "filled";
  const isPaused = job.status === "paused" || job.status === "archived";

  if (isFilled || isPaused) {
    return (
      <div className="job-closed-notice-card" role="alert">
        <AlertCircle size={28} className="text-danger" />
        <div>
          <h3>Inscrições Não Disponíveis</h3>
          <p>
            {isFilled
              ? "Esta vaga já foi preenchida pela empresa e não está mais recebendo novas candidaturas."
              : "Esta oportunidade de emprego está temporariamente pausada ou encerrada."}
          </p>
          <Link href="/empregos" className="button button-secondary">
            Ver outras vagas disponíveis em Viamão
          </Link>
        </div>
      </div>
    );
  }

  function handleAnswerChange(qId: string, val: string) {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  }

  function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("O arquivo do currículo não pode exceder 5 MB.");
      return;
    }
    setError(null);
    setResumeFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validações básicas
    if (!formData.candidateName.trim() || !formData.candidateEmail.trim() || !formData.candidatePhone.trim()) {
      setError("Por favor preencha todos os campos obrigatórios (Nome, E-mail e Telefone).");
      return;
    }

    if (!formData.consentLgpd) {
      setError("Você deve concordar com os termos de consentimento LGPD para submeter sua candidatura.");
      return;
    }

    // Validar perguntas obrigatórias
    if (job.questions && job.questions.length > 0) {
      for (const q of job.questions) {
        if (q.required && (!answers[q.id] || answers[q.id].trim() === "")) {
          setError(`Responda à pergunta obrigatória: "${q.prompt}"`);
          return;
        }
      }
    }

    setLoading(true);

    try {
      const formattedAnswers = (job.questions || []).map((q) => ({
        questionId: q.id,
        prompt: q.prompt,
        answer: answers[q.id] || "Não respondido",
      }));

      const res = await jobsStore.submitApplication({
        jobId: job.id,
        candidateName: formData.candidateName,
        candidateEmail: formData.candidateEmail,
        candidatePhone: formData.candidatePhone,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        bio: formData.bio,
        resumeName: resumeFile ? resumeFile.name : undefined,
        videoPitchUrl: videoData ? videoData.url : undefined,
        videoPitchDuration: videoData ? videoData.duration : undefined,
        videoPitchSize: videoData ? videoData.size : undefined,
        answers: formattedAnswers,
        consentLgpd: true,
      });

      if (!res.success) {
        setError(res.error || "Erro ao processar candidatura.");
        setLoading(false);
        return;
      }

      setSuccessProtocol(res.applicationId || "PROTOCOLO-OK");
    } catch (err: any) {
      setError("Erro interno ao enviar candidatura. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (successProtocol) {
    return (
      <div className="application-success-box" role="status">
        <div className="success-badge-icon">
          <CheckCircle2 size={44} className="text-success" />
        </div>
        <h2>Candidatura Enviada com Sucesso!</h2>
        <p className="success-subtitle">
          Seus dados e materiais foram entregues diretamente à equipe de recrutamento da <strong>{job.companyName}</strong>.
        </p>

        <div className="protocol-card">
          <span>Protocolo de Inscrição:</span>
          <strong>{successProtocol}</strong>
          <small>Guarde este código para acompanhar o processo seletivo.</small>
        </div>

        <div className="success-actions">
          <Link
            href={`/candidato/minhas-candidaturas?email=${encodeURIComponent(formData.candidateEmail)}`}
            className="button button-primary"
          >
            Acompanhar Minhas Candidaturas <ArrowRight size={16} />
          </Link>
          <Link href="/empregos" className="button button-secondary">
            Explorar outras vagas em Viamão
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="application-form" onSubmit={handleSubmit} noValidate>
      <div className="form-job-summary-bar">
        <div>
          <span className="summary-eyebrow">CANDIDATURA PARA:</span>
          <h3>{job.title}</h3>
          <p className="summary-meta">
            <Building2 size={14} className="text-amber" /> {job.companyName} • {job.locationText} • {job.workMode}
          </p>
        </div>
      </div>

      {error && (
        <div className="form-error-banner" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* SEÇÃO 1: DADOS PESSOAIS */}
      <fieldset className="form-section">
        <legend className="section-title">
          <User size={18} className="text-amber" /> 1. Seus Dados Pessoais e Contato
        </legend>
        <p className="section-help">Informações que a empresa utilizará para entrar em contato com você.</p>

        <div className="form-grid-2">
          <label htmlFor="candidateName" className="form-label">
            Nome Completo *
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input
                id="candidateName"
                type="text"
                required
                placeholder="Ex: Maria da Silva"
                value={formData.candidateName}
                onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
              />
            </div>
          </label>

          <label htmlFor="candidateEmail" className="form-label">
            E-mail para Contato *
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                id="candidateEmail"
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={formData.candidateEmail}
                onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
              />
            </div>
          </label>
        </div>

        <div className="form-grid-3">
          <label htmlFor="candidatePhone" className="form-label">
            Telefone / WhatsApp *
            <div className="input-wrap">
              <Phone size={16} className="input-icon" />
              <input
                id="candidatePhone"
                type="tel"
                required
                placeholder="(51) 98765-4321"
                value={formData.candidatePhone}
                onChange={(e) => setFormData({ ...formData, candidatePhone: e.target.value })}
              />
            </div>
          </label>

          <label htmlFor="linkedinUrl" className="form-label">
            LinkedIn (opcional)
            <div className="input-wrap">
              <Linkedin size={16} className="input-icon" />
              <input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/seu-perfil"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              />
            </div>
          </label>

          <label htmlFor="portfolioUrl" className="form-label">
            Portfólio / Site (opcional)
            <div className="input-wrap">
              <Globe size={16} className="input-icon" />
              <input
                id="portfolioUrl"
                type="url"
                placeholder="https://meusite.com.br"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              />
            </div>
          </label>
        </div>

        <label htmlFor="bio" className="form-label">
          Resumo Profissional / Apresentação Rápida
          <textarea
            id="bio"
            rows={3}
            placeholder="Conte um pouco sobre suas principais experiências, pontos fortes ou por que gostaria de trabalhar nesta vaga..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </label>
      </fieldset>

      {/* SEÇÃO 2: PERGUNTAS ESPECÍFICAS DA VAGA */}
      {job.questions && job.questions.length > 0 && (
        <fieldset className="form-section">
          <legend className="section-title">
            <FileText size={18} className="text-amber" /> 2. Perguntas da Empresa Contratante
          </legend>
          <p className="section-help">Responda às questões formuladas pelo recrutador desta vaga.</p>

          <div className="questions-list">
            {job.questions.map((q, idx) => (
              <div key={q.id} className="question-item">
                <label className="question-prompt">
                  <strong>
                    {idx + 1}. {q.prompt} {q.required && <span className="text-danger">*</span>}
                  </strong>

                  {q.type === "choice" && q.options && (
                    <select
                      className="form-select"
                      required={q.required}
                      value={answers[q.id] || ""}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    >
                      <option value="">Selecione uma opção...</option>
                      {q.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {q.type === "boolean" && (
                    <div className="boolean-radio-row">
                      <label className="radio-opt">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value="Sim"
                          checked={answers[q.id] === "Sim"}
                          onChange={() => handleAnswerChange(q.id, "Sim")}
                        />
                        Sim
                      </label>
                      <label className="radio-opt">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value="Não"
                          checked={answers[q.id] === "Não"}
                          onChange={() => handleAnswerChange(q.id, "Não")}
                        />
                        Não
                      </label>
                    </div>
                  )}

                  {q.type === "text" && (
                    <textarea
                      rows={2}
                      className="form-textarea"
                      placeholder="Sua resposta..."
                      required={q.required}
                      value={answers[q.id] || ""}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    />
                  )}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      )}

      {/* SEÇÃO 3: ANEXO DE CURRÍCULO */}
      <fieldset className="form-section">
        <legend className="section-title">
          <UploadCloud size={18} className="text-amber" /> 3. Anexo de Currículo
        </legend>
        <p className="section-help">Anexe seu arquivo em PDF ou Word (DOC/DOCX) de até 5 MB.</p>

        <div className="resume-upload-box">
          <input
            id="resumeFile"
            type="file"
            accept=".pdf,.doc,.docx"
            className="sr-only"
            onChange={handleResumeChange}
          />
          <label htmlFor="resumeFile" className="resume-drop-label">
            <FileText size={28} className="text-amber" />
            {resumeFile ? (
              <div className="file-selected-info">
                <strong>{resumeFile.name}</strong>
                <span>{(resumeFile.size / 1024).toFixed(1)} KB — Clique para substituir</span>
              </div>
            ) : (
              <div>
                <strong>Clique para selecionar seu currículo</strong>
                <span>Formatos suportados: PDF, DOC, DOCX</span>
              </div>
            )}
          </label>
        </div>
      </fieldset>

      {/* SEÇÃO 4: VÍDEO PITCH DE APRESENTAÇÃO */}
      <fieldset className="form-section">
        <legend className="section-title">
          <VideoPitchRecorder onVideoReady={(v) => setVideoData(v)} />
        </legend>
      </fieldset>

      {/* SEÇÃO 5: TERMO DE CONSENTIMENTO LGPD */}
      <fieldset className="form-section lgpd-section">
        <div className="lgpd-box">
          <ShieldCheck size={22} className="text-amber" />
          <div className="lgpd-text">
            <strong>Tratamento de Dados Pessoais e Privacidade (LGPD)</strong>
            <p>
              Ao submeter esta candidatura, você autoriza o Portal TV Viamão a compartilhar exclusivamente com a empresa
              contratante (<strong>{job.companyName}</strong>) os dados de contato, currículo e vídeo de apresentação fornecidos.
              Seus dados não serão comercializados nem utilizados para outros fins.
            </p>
            <label className="checkbox-label lgpd-checkbox">
              <input
                type="checkbox"
                required
                checked={formData.consentLgpd}
                onChange={(e) => setFormData({ ...formData, consentLgpd: e.target.checked })}
              />
              <span>Concordo com os termos e autorizo o envio dos meus dados para o processo seletivo desta vaga.</span>
            </label>
          </div>
        </div>
      </fieldset>

      {/* SUBMIT BUTTON */}
      <div className="form-submit-row">
        <button
          type="submit"
          className="button button-primary button-lg"
          disabled={loading}
        >
          {loading ? (
            "Enviando Candidatura..."
          ) : (
            <>
              <Send size={18} /> Confirmar e Enviar Candidatura
            </>
          )}
        </button>
        <Link href={`/empregos/${job.slug}`} className="button button-ghost">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
