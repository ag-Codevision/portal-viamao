import test from "node:test";
import assert from "node:assert/strict";
import { jobsStore } from "../src/lib/data/jobs-mock-store";
import {
  companyJobSchema,
  applicationSubmissionSchema,
} from "../src/lib/validation/job-module";

test("Trabalhe Conosco — Listagem pública e filtros de vagas", async () => {
  const allPublic = await jobsStore.listPublicJobs();
  assert.ok(allPublic.length > 0, "Deve haver vagas públicas");

  // Filtro por área
  const commerce = await jobsStore.listPublicJobs({ area: "Comércio" });
  assert.ok(commerce.length > 0, "Deve encontrar vagas de Comércio");
  assert.ok(commerce.every((j) => j.area === "Comércio"));

  // Filtro por modalidade
  const presencial = await jobsStore.listPublicJobs({ workMode: "Presencial" });
  assert.ok(presencial.length > 0);
  assert.ok(presencial.every((j) => j.workMode === "Presencial"));

  // Busca textual normalizada
  const searchResults = await jobsStore.listPublicJobs({ query: "centro" });
  assert.ok(searchResults.length > 0);
  assert.ok(
    searchResults.some((j) => j.title.toLowerCase().includes("atendente") || j.locationText.toLowerCase().includes("centro"))
  );
});

test("Trabalhe Conosco — Regra de Negócio: Vaga preenchida rejeita candidaturas", async () => {
  // job-4 está com status 'filled' (Preenchida)
  const filledJob = await jobsStore.getJobById("job-4");
  assert.ok(filledJob);
  assert.equal(filledJob.status, "filled");

  const result = await jobsStore.submitApplication({
    jobId: "job-4",
    candidateName: "Teste Bloqueio",
    candidateEmail: "teste.bloqueio@exemplo.com",
    candidatePhone: "(51) 99999-0000",
    consentLgpd: true,
    answers: [],
  });

  assert.equal(result.success, false);
  assert.match(result.error || "", /preenchida/i, "Deve informar que a vaga já foi preenchida");
});

test("Trabalhe Conosco — Regra de Negócio: Prevenção rígida contra duplicidade", async () => {
  const candidateEmail = "candidato.unico@teste.com";

  // Primeiro envio bem-sucedido
  const firstTry = await jobsStore.submitApplication({
    jobId: "job-1",
    candidateName: "Candidato Único",
    candidateEmail,
    candidatePhone: "(51) 98888-1111",
    consentLgpd: true,
    answers: [],
  });

  assert.equal(firstTry.success, true, "Primeira tentativa deve ser aceita");
  assert.ok(firstTry.applicationId);

  // Segunda tentativa com mesmo e-mail para a mesma vaga
  const secondTry = await jobsStore.submitApplication({
    jobId: "job-1",
    candidateName: "Candidato Único",
    candidateEmail,
    candidatePhone: "(51) 98888-1111",
    consentLgpd: true,
    answers: [],
  });

  assert.equal(secondTry.success, false, "Segunda tentativa deve ser rejeitada");
  assert.match(secondTry.error || "", /já enviou sua candidatura/i);
});

test("Trabalhe Conosco — Regra de Negócio: Isolamento Multi-tenant entre empresas", async () => {
  // job-1 pertence à company-0 (Mercado da Praça)
  const job1 = await jobsStore.getJobById("job-1");
  assert.ok(job1);
  assert.equal(job1.companyId, "company-0");

  // Acesso autorizado: company-0 pode listar candidatos de job-1
  const authorizedApps = await jobsStore.listJobApplications("company-0", "job-1");
  assert.ok(Array.isArray(authorizedApps));
  assert.ok(authorizedApps.length > 0);

  // Acesso proibido: company-1 (Ateliê Raízes) tenta acessar candidatos de job-1
  const unauthorizedApps = await jobsStore.listJobApplications("company-1", "job-1");
  assert.equal(unauthorizedApps.length, 0, "Empresa não autorizada não deve ver candidatos de outra empresa");
});

test("Trabalhe Conosco — Validações Zod (Schemas de Entrada)", () => {
  // Schema de Criação de Vaga
  const validJob = companyJobSchema.safeParse({
    title: "Vendedor de Loja",
    area: "Comércio",
    employmentType: "CLT",
    workMode: "Presencial",
    shift: "Integral",
    locationText: "Centro • Viamão/RS",
    salary: "R$ 2.000,00",
    description: "Vaga para atendimento ao cliente e suporte operacional na loja física.",
    requirements: ["Ensino Médio", "Boa comunicação"],
    benefits: ["Vale Transporte"],
    expiresInDays: 30,
    questions: [],
  });
  assert.equal(validJob.success, true);

  // Rejeição por descrição muito curta
  const invalidJob = companyJobSchema.safeParse({
    title: "Vendedor",
    area: "Comércio",
    employmentType: "CLT",
    workMode: "Presencial",
    shift: "Integral",
    locationText: "Centro",
    description: "Curto", // < 30 chars
    requirements: [],
    expiresInDays: 30,
    questions: [],
  });
  assert.equal(invalidJob.success, false);

  // Schema de Candidatura: Rejeição sem consentimento LGPD
  const invalidApp = applicationSubmissionSchema.safeParse({
    jobId: "job-1",
    candidateName: "João",
    candidateEmail: "joao@email.com",
    candidatePhone: "(51) 99999-9999",
    consentLgpd: false, // Inválido
  });
  assert.equal(invalidApp.success, false);
});

test("Trabalhe Conosco — Funil de Triagem: Atualização de etapa pela empresa", async () => {
  // Atualizar status do app-2 para 'interview' pela empresa dona (company-0)
  const updated = await jobsStore.updateApplicationStatus(
    "company-0",
    "app-2",
    "interview",
    "Entrevista agendada para sexta-feira"
  );

  assert.ok(updated);
  assert.equal(updated.status, "interview");
  assert.equal(updated.recruiterNotes, "Entrevista agendada para sexta-feira");

  // Tentativa de atualização por empresa não autorizada (company-1)
  const unauthorizedUpdate = await jobsStore.updateApplicationStatus(
    "company-1",
    "app-2",
    "approved"
  );
  assert.equal(unauthorizedUpdate, null, "Empresa não autorizada não pode alterar status");
});
