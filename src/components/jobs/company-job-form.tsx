"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Building2,
  DollarSign,
  Clock,
  MapPin,
} from "lucide-react";
import type { Job, JobQuestion } from "@/types";
import { jobsStore } from "@/lib/data/jobs-mock-store";

interface CompanyJobFormProps {
  companyId: string;
  initialJob?: Job | null;
}

export function CompanyJobForm({ companyId, initialJob }: CompanyJobFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialJob?.title || "");
  const [area, setArea] = useState(initialJob?.area || "Comércio");
  const [employmentType, setEmploymentType] = useState<any>(initialJob?.employmentType || "CLT");
  const [workMode, setWorkMode] = useState<any>(initialJob?.workMode || "Presencial");
  const [shift, setShift] = useState<any>(initialJob?.shift || "Integral");
  const [locationText, setLocationText] = useState(initialJob?.locationText || "Centro • Viamão/RS");
  const [salary, setSalary] = useState(initialJob?.salary || "");
  const [description, setDescription] = useState(initialJob?.description || "");
  const [requirements, setRequirements] = useState<string[]>(
    initialJob?.requirements && initialJob.requirements.length > 0
      ? initialJob.requirements
      : ["Comunicação clara e atenção ao público"]
  );
  const [benefits, setBenefits] = useState<string[]>(
    initialJob?.benefits && initialJob.benefits.length > 0
      ? initialJob.benefits
      : ["Vale Transporte", "Vale Refeição"]
  );
  const [questions, setQuestions] = useState<JobQuestion[]>(
    initialJob?.questions && initialJob.questions.length > 0
      ? initialJob.questions
      : [
          {
            id: "q-1",
            prompt: "Possui experiência anterior nesta função ou área similar?",
            type: "choice",
            options: ["Sim, mais de 1 ano", "Sim, menos de 1 ano", "Não possuo experiência"],
            required: true,
            order: 1,
          },
        ]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Manipuladores de Requisitos
  function addRequirement() {
    setRequirements([...requirements, ""]);
  }
  function updateRequirement(index: number, val: string) {
    const updated = [...requirements];
    updated[index] = val;
    setRequirements(updated);
  }
  function removeRequirement(index: number) {
    setRequirements(requirements.filter((_, i) => i !== index));
  }

  // Manipuladores de Benefícios
  function addBenefit() {
    setBenefits([...benefits, ""]);
  }
  function updateBenefit(index: number, val: string) {
    const updated = [...benefits];
    updated[index] = val;
    setBenefits(updated);
  }
  function removeBenefit(index: number) {
    setBenefits(benefits.filter((_, i) => i !== index));
  }

  // Manipuladores de Perguntas
  function addQuestion() {
    if (questions.length >= 5) {
      setError("O limite máximo é de 5 perguntas personalizadas por vaga.");
      return;
    }
    setQuestions([
      ...questions,
      {
        id: `q-${Date.now()}`,
        prompt: "",
        type: "text",
        required: false,
        order: questions.length + 1,
      },
    ]);
  }

  function updateQuestion(index: number, field: keyof JobQuestion, val: any) {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: val };
    setQuestions(updated);
  }

  function removeQuestion(index: number) {
    setQuestions(questions.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError("Informe o cargo e a descrição detalhada da oportunidade.");
      return;
    }

    const filteredReqs = requirements.filter((r) => r.trim().length > 0);
    if (filteredReqs.length === 0) {
      setError("Adicione pelo menos um requisito para a vaga.");
      return;
    }

    const filteredBenefits = benefits.filter((b) => b.trim().length > 0);

    setLoading(true);

    try {
      if (initialJob) {
        // Atualização
        await jobsStore.updateJob(companyId, initialJob.id, {
          title,
          area,
          employmentType,
          workMode,
          shift,
          locationText,
          salary,
          description,
          requirements: filteredReqs,
          benefits: filteredBenefits,
          questions,
        });
      } else {
        // Criação
        await jobsStore.createJob(companyId, {
          title,
          area,
          employmentType,
          workMode,
          shift,
          locationText,
          salary,
          description,
          requirements: filteredReqs,
          benefits: filteredBenefits,
          expiresInDays: 30,
          questions,
          salaryIsPublic: true,
        });
      }

      router.push(`/empresas/vagas?companyId=${companyId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar a vaga. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="company-job-editor-form" onSubmit={handleSubmit}>
      {error && (
        <div className="form-error-banner" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* DADOS PRINCIPAIS */}
      <fieldset className="editor-section">
        <legend className="section-title">
          <Briefcase size={18} className="text-amber" /> Dados Principais do Cargo
        </legend>

        <label htmlFor="jobTitle" className="form-label">
          Título do Cargo / Vaga *
          <input
            id="jobTitle"
            type="text"
            required
            placeholder="Ex: Balconista de Padaria, Auxiliar de Escritório..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <div className="form-grid-3">
          <label htmlFor="area" className="form-label">
            Área de Atuação *
            <select
              id="area"
              className="form-select"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="Comércio">Comércio</option>
              <option value="Administrativo">Administrativo</option>
              <option value="Logística">Logística</option>
              <option value="Alimentação">Alimentação / Gastronomia</option>
              <option value="Serviços Gerais">Serviços Gerais</option>
              <option value="Saúde">Saúde</option>
              <option value="Educação">Educação</option>
              <option value="Tecnologia">Tecnologia</option>
            </select>
          </label>

          <label htmlFor="employmentType" className="form-label">
            Regime de Contratação *
            <select
              id="employmentType"
              className="form-select"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              <option value="CLT">CLT (Efetivo)</option>
              <option value="PJ">PJ</option>
              <option value="MEI">MEI / Prestador</option>
              <option value="Estágio">Estágio</option>
              <option value="Temporário">Temporário</option>
            </select>
          </label>

          <label htmlFor="workMode" className="form-label">
            Modalidade de Trabalho *
            <select
              id="workMode"
              className="form-select"
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
            >
              <option value="Presencial">Presencial</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Remoto">Remoto</option>
            </select>
          </label>
        </div>

        <div className="form-grid-3">
          <label htmlFor="shift" className="form-label">
            Turno / Horário *
            <select
              id="shift"
              className="form-select"
              value={shift}
              onChange={(e) => setShift(e.target.value)}
            >
              <option value="Integral">Integral (Comercial)</option>
              <option value="Manhã">Turno Manhã</option>
              <option value="Tarde">Turno Tarde</option>
              <option value="Noite">Turno Noite</option>
              <option value="Escala">Escala 12x36 / 6x1</option>
            </select>
          </label>

          <label htmlFor="locationText" className="form-label">
            Bairro / Local em Viamão *
            <input
              id="locationText"
              type="text"
              required
              placeholder="Ex: Centro • Viamão/RS"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
            />
          </label>

          <label htmlFor="salary" className="form-label">
            Remuneração Informada
            <input
              id="salary"
              type="text"
              placeholder="Ex: R$ 1.950,00 ou A combinar"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </label>
        </div>

        <label htmlFor="description" className="form-label">
          Descrição Detalhada das Atividades *
          <textarea
            id="description"
            rows={5}
            required
            placeholder="Descreva o dia a dia da função, responsabilidades e o que o candidato irá vivenciar..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </fieldset>

      {/* REQUISITOS E BENEFÍCIOS */}
      <fieldset className="editor-section">
        <legend className="section-title">
          <Sparkles size={18} className="text-amber" /> Requisitos e Benefícios
        </legend>

        <div className="dynamic-list-wrapper">
          <div className="list-header">
            <strong>Requisitos e Perfil Desejado *</strong>
            <button
              type="button"
              className="button button-secondary-compact"
              onClick={addRequirement}
            >
              <Plus size={14} /> Adicionar Requisito
            </button>
          </div>

          {requirements.map((req, idx) => (
            <div key={idx} className="dynamic-row">
              <input
                type="text"
                placeholder="Ex: Ensino Médio completo, experiência com atendimento..."
                value={req}
                onChange={(e) => updateRequirement(idx, e.target.value)}
              />
              {requirements.length > 1 && (
                <button
                  type="button"
                  className="icon-btn-danger"
                  aria-label="Remover requisito"
                  onClick={() => removeRequirement(idx)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="dynamic-list-wrapper mt-4">
          <div className="list-header">
            <strong>Benefícios Oferecidos</strong>
            <button
              type="button"
              className="button button-secondary-compact"
              onClick={addBenefit}
            >
              <Plus size={14} /> Adicionar Benefício
            </button>
          </div>

          {benefits.map((ben, idx) => (
            <div key={idx} className="dynamic-row">
              <input
                type="text"
                placeholder="Ex: Vale Transporte, Vale Refeição, Plano de Saúde..."
                value={ben}
                onChange={(e) => updateBenefit(idx, e.target.value)}
              />
              <button
                type="button"
                className="icon-btn-danger"
                aria-label="Remover benefício"
                onClick={() => removeBenefit(idx)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </fieldset>

      {/* PERGUNTAS ESPECÍFICAS PARA O CANDIDATO */}
      <fieldset className="editor-section">
        <div className="section-header-row">
          <div>
            <legend className="section-title">
              <HelpCircle size={18} className="text-amber" /> Perguntas para os Candidatos
            </legend>
            <p className="section-help">
              Defina até 5 perguntas que os candidatos deverão responder ao se inscrever (múltipla escolha, sim/não ou texto).
            </p>
          </div>
          {questions.length < 5 && (
            <button
              type="button"
              className="button button-secondary-compact"
              onClick={addQuestion}
            >
              <Plus size={14} /> Nova Pergunta
            </button>
          )}
        </div>

        {questions.length === 0 ? (
          <p className="empty-questions-notice">Nenhuma pergunta adicional cadastrada. O candidato enviará apenas os dados de perfil, currículo e vídeo pitch.</p>
        ) : (
          <div className="questions-editor-list">
            {questions.map((q, idx) => (
              <div key={q.id || idx} className="question-editor-card">
                <div className="q-card-top">
                  <span className="q-num">Pergunta #{idx + 1}</span>
                  <button
                    type="button"
                    className="icon-btn-danger"
                    onClick={() => removeQuestion(idx)}
                    aria-label={`Excluir pergunta ${idx + 1}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="form-grid-2">
                  <label className="form-label">
                    Enunciado da Pergunta *
                    <input
                      type="text"
                      placeholder="Ex: Você possui condução própria para trabalhar em Itapuã?"
                      value={q.prompt}
                      onChange={(e) => updateQuestion(idx, "prompt", e.target.value)}
                    />
                  </label>

                  <label className="form-label">
                    Tipo de Resposta
                    <select
                      className="form-select"
                      value={q.type}
                      onChange={(e) => updateQuestion(idx, "type", e.target.value)}
                    >
                      <option value="text">Texto Livre</option>
                      <option value="boolean">Sim ou Não</option>
                      <option value="choice">Múltipla Escolha (Opções)</option>
                    </select>
                  </label>
                </div>

                {q.type === "choice" && (
                  <label className="form-label">
                    Opções de Resposta (separadas por vírgula)
                    <input
                      type="text"
                      placeholder="Ex: Opção A, Opção B, Opção C"
                      value={(q.options || []).join(", ")}
                      onChange={(e) =>
                        updateQuestion(
                          idx,
                          "options",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                  </label>
                )}

                <label className="checkbox-label inline-checkbox">
                  <input
                    type="checkbox"
                    checked={q.required}
                    onChange={(e) => updateQuestion(idx, "required", e.target.checked)}
                  />
                  <span>Resposta obrigatória para o candidato</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      <div className="form-actions-bar">
        <button
          type="submit"
          className="button button-primary button-lg"
          disabled={loading}
        >
          {loading ? "Salvando Vaga..." : initialJob ? "Atualizar Oportunidade" : "Publicar Oportunidade"}
        </button>
        <button
          type="button"
          className="button button-ghost"
          onClick={() => router.back()}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
