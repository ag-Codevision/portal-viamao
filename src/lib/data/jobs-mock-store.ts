import type {
  Job,
  JobFilters,
  Company,
  JobApplication,
  JobApplicationStatus,
  JobStatus,
  JobQuestion,
} from "@/types";
import type { CompanyJobFormData, ApplicationSubmissionFormData } from "@/lib/validation/job-module";
import type { JobsModuleRepository } from "./jobs-contracts";
import { normalize } from "@/lib/utils";

// 1. EMPRESAS INICIAIS MOCKADAS DE VIAMÃO
export const initialCompanies: Company[] = [
  {
    id: "company-0",
    cityId: "viamao",
    name: "Mercado da Praça",
    slug: "mercado-da-praca",
    logoUrl: "/images/companies/mercado-da-praca.png",
    description: "Comércio tradicional no Centro de Viamão, referência em atendimento e produtos locais há mais de 25 anos.",
    contactEmail: "vagas@mercadodapraca.com.br",
    phone: "(51) 3485-1020",
    websiteUrl: "https://mercadodapraca.com.br",
    status: "active",
    planType: "anunciante",
  },
  {
    id: "company-1",
    cityId: "viamao",
    name: "Ateliê Raízes",
    slug: "atelie-raizes",
    logoUrl: "/images/companies/atelie-raizes.png",
    description: "Estúdio de criação, confecção e artesanato autoral no bairro Santa Isabel.",
    contactEmail: "contato@atelieraizes.com.br",
    phone: "(51) 3485-4080",
    status: "active",
    planType: "assinante",
  },
  {
    id: "company-2",
    cityId: "viamao",
    name: "Cooperativa Horizonte",
    slug: "cooperativa-horizonte",
    logoUrl: "/images/companies/cooperativa-horizonte.png",
    description: "Cooperativa agroflorestal e de logística sustentável que atende todo o território viamonense.",
    contactEmail: "rh@coophorizonte.org.br",
    phone: "(51) 3492-8800",
    status: "active",
    planType: "assinante",
  },
  {
    id: "company-3",
    cityId: "viamao",
    name: "Distribuidora Tarumã",
    slug: "distribuidora-taruma",
    logoUrl: "/images/companies/distribuidora-taruma.png",
    description: "Armazenagem, logística expressa e distribuição de mercadorias na região de Viamópolis.",
    contactEmail: "talentos@distribuidorataruma.com.br",
    phone: "(51) 3485-9911",
    status: "active",
    planType: "anunciante",
  },
];

// 2. VAGAS INICIAIS MOCKADAS
export const initialJobs: Job[] = [
  {
    id: "job-1",
    cityId: "viamao",
    companyId: "company-0",
    companyName: "Mercado da Praça",
    companyLogoUrl: "/images/companies/mercado-da-praca.png",
    slug: "atendente-de-loja-centro",
    title: "Atendente de Loja e Frente de Caixa",
    description:
      "Estamos em busca de profissionais comunicativos e prestativos para atuar no atendimento aos clientes, pesagem e frente de caixa. Não exigimos experiência prévia; valorizamos disposição e simpatia com a comunidade local.",
    requirements: [
      "Ensino Médio completo",
      "Boa comunicação interpessoal",
      "Disponibilidade para trabalhar em escala 6x1 no Centro de Viamão",
    ],
    benefits: ["Vale Transporte", "Vale Refeição (R$ 28/dia)", "Desconto em compras de 15%", "Convênio Farmácia"],
    area: "Comércio",
    employmentType: "CLT",
    workMode: "Presencial",
    shift: "Tarde",
    locationText: "Centro • Viamão/RS",
    salary: "R$ 1.850,00 a R$ 2.150,00",
    salaryMin: 1850,
    salaryMax: 2150,
    salaryIsPublic: true,
    publishedAt: "2026-10-10T12:00:00Z",
    expiresAt: "2026-11-20T23:59:59Z",
    applicationUrl: null,
    status: "published",
    applicationsCount: 3,
    questions: [
      {
        id: "q1",
        jobId: "job-1",
        prompt: "Você já possui experiência prévia com atendimento ao público ou frente de caixa?",
        type: "choice",
        options: ["Sim, mais de 1 ano", "Sim, menos de 1 ano", "Não, é minha primeira oportunidade"],
        required: true,
        order: 1,
      },
      {
        id: "q2",
        jobId: "job-1",
        prompt: "Você reside em Viamão ou possui facilidade de locomoção até o Centro?",
        type: "boolean",
        required: true,
        order: 2,
      },
    ],
  },
  {
    id: "job-2",
    cityId: "viamao",
    companyId: "company-1",
    companyName: "Ateliê Raízes",
    companyLogoUrl: "/images/companies/atelie-raizes.png",
    slug: "assistente-administrativo-financeiro",
    title: "Assistente Administrativo e Financeiro",
    description:
      "Apoio direto à organização de rotinas financeiras, contas a pagar/receber, emissão de notas fiscais e atendimento digital aos clientes do ateliê. Modelo híbrido com 3 dias presenciais no ateliê e 2 dias home office.",
    requirements: [
      "Ensino Médio completo ou Superior em andamento (Administração, Contabilidade ou afins)",
      "Conhecimento prático de Excel / planilhas e boa escrita",
      "Organização, atenção a detalhes e pontualidade",
    ],
    benefits: ["Auxílio Home Office", "Vale Transporte", "Plano Odontológico", "Seguro de Vida"],
    area: "Administrativo",
    employmentType: "CLT",
    workMode: "Híbrido",
    shift: "Integral",
    locationText: "Santa Isabel • Viamão/RS",
    salary: "R$ 2.300,00 a R$ 2.700,00",
    salaryMin: 2300,
    salaryMax: 2700,
    salaryIsPublic: true,
    publishedAt: "2026-10-12T10:00:00Z",
    expiresAt: "2026-11-25T23:59:59Z",
    applicationUrl: null,
    status: "published",
    applicationsCount: 2,
    questions: [
      {
        id: "q3",
        jobId: "job-2",
        prompt: "Qual é o seu nível de domínio com planilhas (Excel / Google Planilhas)?",
        type: "choice",
        options: ["Básico", "Intermediário (Procv, tabela dinâmica)", "Avançado"],
        required: true,
        order: 1,
      },
      {
        id: "q4",
        jobId: "job-2",
        prompt: "Conte brevemente uma situação em que sua organização fez a diferença em um projeto ou trabalho.",
        type: "text",
        required: false,
        order: 2,
      },
    ],
  },
  {
    id: "job-3",
    cityId: "viamao",
    companyId: "company-2",
    companyName: "Cooperativa Horizonte",
    companyLogoUrl: "/images/companies/cooperativa-horizonte.png",
    slug: "auxiliar-de-logistica-e-estoque",
    title: "Auxiliar de Logística e Estoque",
    description:
      "Operações de carga, descarga, conferência de insumos, expedição e controle de armazenamento de itens agroflorestais. Trabalho dinâmico em equipe focada na agricultura familiar e escoamento sustentável.",
    requirements: [
      "Ensino Fundamental ou Médio",
      "Disposição física para conferência e movimentação de mercadorias",
      "Comprometimento com normas de segurança do trabalho",
    ],
    benefits: ["Cesta de Alimentos Orgânicos da Cooperativa", "Refeitório no local", "Vale Transporte", "PPR Semestral"],
    area: "Logística",
    employmentType: "CLT",
    workMode: "Presencial",
    shift: "Manhã",
    locationText: "Itapuã • Viamão/RS",
    salary: "R$ 2.100,00",
    salaryMin: 2100,
    salaryMax: 2100,
    salaryIsPublic: true,
    publishedAt: "2026-10-14T08:30:00Z",
    expiresAt: "2026-11-30T23:59:59Z",
    applicationUrl: null,
    status: "published",
    applicationsCount: 1,
    questions: [
      {
        id: "q5",
        jobId: "job-3",
        prompt: "Possui CNH categoria B ou superior?",
        type: "boolean",
        required: false,
        order: 1,
      },
    ],
  },
  {
    id: "job-4",
    cityId: "viamao",
    companyId: "company-3",
    companyName: "Distribuidora Tarumã",
    companyLogoUrl: "/images/companies/distribuidora-taruma.png",
    slug: "motorista-entregador-categoria-b-preenchida",
    title: "Motorista Entregador — Categoria B",
    description:
      "Realização de entregas diárias no comércio de Viamão, Alvorada e zona leste de Porto Alegre. Vaga preenchida recentemente pela equipe de seleção.",
    requirements: ["CNH B definitiva e EAR", "Experiência com rotas urbanas", "Pontualidade"],
    benefits: ["Vale Refeição", "Seguro de Vida", "Bonificação por entrega"],
    area: "Logística",
    employmentType: "CLT",
    workMode: "Presencial",
    shift: "Integral",
    locationText: "Viamópolis • Viamão/RS",
    salary: "R$ 2.600,00",
    salaryMin: 2600,
    salaryMax: 2600,
    salaryIsPublic: true,
    publishedAt: "2026-09-20T10:00:00Z",
    expiresAt: "2026-11-01T23:59:59Z",
    applicationUrl: null,
    // VAGA PREENCHIDA — PARA DEMOSTRAR O BLOQUEIO DE INSCRIÇÕES E STATUS
    status: "filled",
    applicationsCount: 8,
    questions: [],
  },
];

// 3. CANDIDATURAS INICIAIS MOCKADAS
export const initialApplications: JobApplication[] = [
  {
    id: "app-1",
    jobId: "job-1",
    jobTitle: "Atendente de Loja e Frente de Caixa",
    companyId: "company-0",
    companyName: "Mercado da Praça",
    candidateName: "Juliana Silveira Moreira",
    candidateEmail: "juliana.silveira.rs@gmail.com",
    candidatePhone: "(51) 98765-4321",
    linkedinUrl: "https://linkedin.com/in/juliana-silveira-demo",
    bio: "Experiência de 2 anos em atendimento e simpatia no comércio viamonense.",
    resumeName: "Curriculo-Juliana-Silveira.pdf",
    videoPitchUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    videoPitchDuration: 45,
    videoPitchSize: 12500000,
    status: "interview",
    appliedAt: "2026-10-11T14:20:00Z",
    recruiterNotes: "Candidata com excelente comunicação no vídeo. Entrevista presencial agendada para quarta-feira.",
    answers: [
      {
        questionId: "q1",
        prompt: "Você já possui experiência prévia com atendimento ao público ou frente de caixa?",
        answer: "Sim, mais de 1 ano",
      },
      {
        questionId: "q2",
        prompt: "Você reside em Viamão ou possui facilidade de locomoção até o Centro?",
        answer: "Sim",
      },
    ],
  },
  {
    id: "app-2",
    jobId: "job-1",
    jobTitle: "Atendente de Loja e Frente de Caixa",
    companyId: "company-0",
    companyName: "Mercado da Praça",
    candidateName: "Carlos Eduardo da Silva",
    candidateEmail: "carlosedu.viam@outlook.com",
    candidatePhone: "(51) 99123-9988",
    bio: "Procurando meu primeiro emprego após concluir o Ensino Médio no Colégio Estadual Setembrina.",
    resumeName: "CV_Carlos_Eduardo.pdf",
    status: "under_review",
    appliedAt: "2026-10-12T09:15:00Z",
    recruiterNotes: "Perfil jovem, muito dedicado. Avaliando disponibilidade para o turno da tarde.",
    answers: [
      {
        questionId: "q1",
        prompt: "Você já possui experiência prévia com atendimento ao público ou frente de caixa?",
        answer: "Não, é minha primeira oportunidade",
      },
      {
        questionId: "q2",
        prompt: "Você reside em Viamão ou possui facilidade de locomoção até o Centro?",
        answer: "Sim",
      },
    ],
  },
  {
    id: "app-3",
    jobId: "job-2",
    jobTitle: "Assistente Administrativo e Financeiro",
    companyId: "company-1",
    companyName: "Ateliê Raízes",
    candidateName: "Mariana Fagundes Becker",
    candidateEmail: "mariana.becker.adm@gmail.com",
    candidatePhone: "(51) 98456-1122",
    linkedinUrl: "https://linkedin.com/in/mariana-becker-demo",
    bio: "Graduanda em Administração na UFRGS, foco em rotinas de conciliação e organização financeira.",
    resumeName: "Mariana_Becker_CV.pdf",
    videoPitchUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    videoPitchDuration: 62,
    videoPitchSize: 18400000,
    status: "submitted",
    appliedAt: "2026-10-13T16:40:00Z",
    recruiterNotes: "Currículo muito alinhado aos requisitos de conciliação bancária.",
    answers: [
      {
        questionId: "q3",
        prompt: "Qual é o seu nível de domínio com planilhas (Excel / Google Planilhas)?",
        answer: "Intermediário (Procv, tabela dinâmica)",
      },
      {
        questionId: "q4",
        prompt: "Conte brevemente uma situação em que sua organização fez a diferença em um projeto ou trabalho.",
        answer: "Automatizei a planilha de controle de pedidos no meu estágio anterior, reduzindo o tempo de fechamento de 3 horas para 40 minutos.",
      },
    ],
  },
];

// 4. CLASSE DE IMPLEMENTAÇÃO DO REPOSITÓRIO MOCK EM MEMÓRIA
class JobsMockStore implements JobsModuleRepository {
  private companies: Company[] = [...initialCompanies];
  private jobs: Job[] = [...initialJobs];
  private applications: JobApplication[] = [...initialApplications];

  async listPublicJobs(filters: JobFilters = {}): Promise<Job[]> {
    const now = new Date().toISOString();
    return this.jobs.filter((j) => {
      // Público só visualiza vagas publicadas ou preenchidas visíveis (com status apropriado)
      if (j.status === "archived" || j.status === "pending_review") return false;
      if (filters.status && j.status !== filters.status) return false;
      if (filters.query) {
        const text = normalize(`${j.title} ${j.description} ${j.locationText} ${j.companyName ?? ""}`);
        if (!text.includes(normalize(filters.query))) return false;
      }
      if (filters.area && j.area !== filters.area) return false;
      if (filters.workMode && j.workMode !== filters.workMode) return false;
      if (filters.employmentType && j.employmentType !== filters.employmentType) return false;
      if (filters.shift && j.shift !== filters.shift) return false;
      return true;
    });
  }

  async getJobBySlug(slug: string): Promise<Job | null> {
    const job = this.jobs.find((j) => j.slug === slug);
    if (!job) return null;
    const company = this.companies.find((c) => c.id === job.companyId);
    return {
      ...job,
      companyName: job.companyName ?? company?.name,
      companyLogoUrl: job.companyLogoUrl ?? company?.logoUrl,
    };
  }

  async getJobById(id: string): Promise<Job | null> {
    const job = this.jobs.find((j) => j.id === id);
    if (!job) return null;
    return job;
  }

  async submitApplication(
    data: ApplicationSubmissionFormData
  ): Promise<{ success: boolean; applicationId?: string; error?: string }> {
    const job = this.jobs.find((j) => j.id === data.jobId);
    if (!job) {
      return { success: false, error: "Vaga não encontrada no sistema." };
    }

    // Regra de negócio: vagas preenchidas ou pausadas não aceitam candidaturas
    if (job.status === "filled") {
      return { success: false, error: "Esta vaga já foi preenchida e não está mais aceitando novas inscrições." };
    }
    if (job.status === "paused" || job.status === "archived") {
      return { success: false, error: "Esta oportunidade está temporariamente pausada ou encerrada." };
    }

    // Regra de negócio: Prevenção rígida contra duplicidade (mesmo email na mesma vaga)
    const normalizedEmail = data.candidateEmail.toLowerCase().trim();
    const existing = this.applications.find(
      (a) => a.jobId === job.id && a.candidateEmail.toLowerCase().trim() === normalizedEmail
    );
    if (existing) {
      return {
        success: false,
        error: "Você já enviou sua candidatura anteriormente para esta vaga. Acompanhe o status no painel do candidato.",
      };
    }

    const company = this.companies.find((c) => c.id === job.companyId);
    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyId: job.companyId,
      companyName: job.companyName ?? company?.name ?? "Empresa Local",
      candidateName: data.candidateName,
      candidateEmail: normalizedEmail,
      candidatePhone: data.candidatePhone,
      linkedinUrl: data.linkedinUrl || undefined,
      portfolioUrl: data.portfolioUrl || undefined,
      bio: data.bio || undefined,
      resumeName: data.resumeName || undefined,
      resumeUrl: data.resumeBase64 ? "data:application/pdf;base64,mock..." : undefined,
      videoPitchUrl: data.videoPitchUrl || undefined,
      videoPitchDuration: data.videoPitchDuration,
      videoPitchSize: data.videoPitchSize,
      status: "submitted",
      appliedAt: new Date().toISOString(),
      answers: data.answers.map((ans) => ({
        questionId: ans.questionId,
        prompt: ans.prompt,
        answer: ans.answer,
      })),
    };

    this.applications.unshift(newApplication);
    job.applicationsCount = (job.applicationsCount || 0) + 1;

    return { success: true, applicationId: newApplication.id };
  }

  async listCandidateApplications(candidateEmail: string): Promise<JobApplication[]> {
    const cleanEmail = candidateEmail.toLowerCase().trim();
    return this.applications.filter((a) => a.candidateEmail.toLowerCase().trim() === cleanEmail);
  }

  // MÉTODOS DE EMPRESA (COM ISOLAMENTO MULTI-TENANT)
  async getCompany(companyId: string): Promise<Company | null> {
    return this.companies.find((c) => c.id === companyId) ?? null;
  }

  async listCompanies(): Promise<Company[]> {
    return [...this.companies];
  }

  async listCompanyJobs(companyId: string): Promise<Job[]> {
    return this.jobs.filter((j) => j.companyId === companyId);
  }

  async createJob(companyId: string, data: CompanyJobFormData): Promise<Job> {
    const company = this.companies.find((c) => c.id === companyId);
    if (!company) throw new Error("Empresa não encontrada.");

    const slug = `${normalize(data.title).replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + (data.expiresInDays || 30));

    const newJob: Job = {
      id: `job-${Date.now()}`,
      cityId: "viamao",
      companyId,
      companyName: company.name,
      companyLogoUrl: company.logoUrl,
      slug,
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      benefits: data.benefits,
      area: data.area,
      employmentType: data.employmentType,
      workMode: data.workMode,
      shift: data.shift,
      locationText: data.locationText,
      salary: data.salary || (data.salaryMin ? `R$ ${data.salaryMin}` : null),
      salaryMin: data.salaryMin || undefined,
      salaryMax: data.salaryMax || undefined,
      salaryIsPublic: data.salaryIsPublic,
      publishedAt: new Date().toISOString(),
      expiresAt: expiresDate.toISOString(),
      applicationUrl: null,
      status: "published",
      applicationsCount: 0,
      questions: data.questions.map((q, idx) => ({
        ...q,
        id: q.id || `q-${Date.now()}-${idx}`,
        order: idx + 1,
      })),
    };

    this.jobs.unshift(newJob);
    return newJob;
  }

  async updateJob(companyId: string, jobId: string, data: Partial<CompanyJobFormData>): Promise<Job | null> {
    const job = this.jobs.find((j) => j.id === jobId && j.companyId === companyId);
    if (!job) return null;

    if (data.title) job.title = data.title;
    if (data.description) job.description = data.description;
    if (data.requirements) job.requirements = data.requirements;
    if (data.benefits) job.benefits = data.benefits;
    if (data.area) job.area = data.area;
    if (data.employmentType) job.employmentType = data.employmentType;
    if (data.workMode) job.workMode = data.workMode;
    if (data.shift) job.shift = data.shift;
    if (data.locationText) job.locationText = data.locationText;
    if (data.salary !== undefined) job.salary = data.salary;
    if (data.questions) {
      job.questions = data.questions.map((q, idx) => ({
        ...q,
        id: q.id || `q-${idx}`,
        order: idx + 1,
      }));
    }

    return job;
  }

  async setJobStatus(companyId: string, jobId: string, status: JobStatus): Promise<Job | null> {
    // Isolamento: só a empresa proprietária pode alterar o status
    const job = this.jobs.find((j) => j.id === jobId && j.companyId === companyId);
    if (!job) return null;
    job.status = status;
    return job;
  }

  async listJobApplications(companyId: string, jobId: string): Promise<JobApplication[]> {
    // Garantia de isolamento multi-tenant: valida se o job pertence de fato à empresa
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job || job.companyId !== companyId) {
      return []; // Proibido o acesso
    }
    return this.applications.filter((a) => a.jobId === jobId);
  }

  async updateApplicationStatus(
    companyId: string,
    applicationId: string,
    status: JobApplicationStatus,
    notes?: string
  ): Promise<JobApplication | null> {
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) return null;

    // Garantia de isolamento: confere se a vaga da aplicação pertence à empresa
    const job = this.jobs.find((j) => j.id === app.jobId);
    if (!job || job.companyId !== companyId) {
      return null;
    }

    app.status = status;
    if (notes !== undefined) {
      app.recruiterNotes = notes;
    }
    return app;
  }

  // MODERAÇÃO ADMINISTRATIVA
  async listAllJobsForAdmin(): Promise<Job[]> {
    return [...this.jobs];
  }

  async moderateJob(jobId: string, action: "approve" | "reject" | "pause"): Promise<boolean> {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) return false;
    if (action === "approve") job.status = "published";
    if (action === "reject") job.status = "archived";
    if (action === "pause") job.status = "paused";
    return true;
  }
}

// Singleton global exportado para toda a aplicação
export const jobsStore = new JobsMockStore();
