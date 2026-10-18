import { z } from "zod";

export const jobQuestionSchema = z.object({
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  prompt: z.string().min(5, "A pergunta deve ter pelo menos 5 caracteres").max(200, "Máximo de 200 caracteres"),
  type: z.enum(["text", "choice", "boolean"]),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
  order: z.number().default(0),
});

export const companyJobSchema = z.object({
  title: z
    .string()
    .min(3, "O cargo deve ter pelo menos 3 caracteres")
    .max(100, "O cargo não pode ultrapassar 100 caracteres"),
  area: z.string().min(2, "Selecione ou informe a área"),
  employmentType: z.enum(["CLT", "PJ", "MEI", "Estágio", "Temporário"]),
  workMode: z.enum(["Presencial", "Híbrido", "Remoto"]),
  shift: z.enum(["Manhã", "Tarde", "Noite", "Integral", "Escala"]),
  locationText: z
    .string()
    .min(3, "Informe a localização ou bairro em Viamão")
    .max(120, "Localização muito longa"),
  salary: z.string().optional().nullable(),
  salaryMin: z.number().optional().nullable(),
  salaryMax: z.number().optional().nullable(),
  salaryIsPublic: z.boolean().default(true),
  description: z
    .string()
    .min(30, "A descrição deve conter pelo menos 30 caracteres explicativos")
    .max(4000, "A descrição não pode ultrapassar 4.000 caracteres"),
  requirements: z
    .array(z.string())
    .min(1, "Informe ao menos um requisito essencial"),
  benefits: z.array(z.string()).default([]),
  expiresInDays: z.number().min(7).max(90).default(30),
  questions: z.array(jobQuestionSchema).max(5, "Máximo de 5 perguntas adicionais").default([]),
});

export const applicationSubmissionSchema = z.object({
  jobId: z.string().min(1, "Vaga não identificada"),
  candidateName: z
    .string()
    .min(3, "Nome completo deve ter pelo menos 3 caracteres")
    .max(120, "Nome muito longo"),
  candidateEmail: z
    .string()
    .email("Informe um endereço de e-mail válido"),
  candidatePhone: z
    .string()
    .min(8, "Informe um telefone para contato com DDD")
    .max(20, "Telefone inválido"),
  linkedinUrl: z
    .string()
    .url("URL do LinkedIn inválida")
    .optional()
    .or(z.literal("")),
  portfolioUrl: z
    .string()
    .url("URL de portfólio inválida")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Resumo profissional pode ter até 500 caracteres")
    .optional(),
  resumeName: z.string().optional(),
  resumeBase64: z.string().optional(),
  videoPitchUrl: z.string().optional(),
  videoPitchDuration: z
    .number()
    .max(120, "O vídeo de apresentação não pode exceder 120 segundos")
    .optional(),
  videoPitchSize: z
    .number()
    .max(104857600, "O tamanho do vídeo não pode exceder 100 MB")
    .optional(),
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        prompt: z.string(),
        answer: z.string(),
      })
    )
    .default([]),
  consentLgpd: z.literal(true, {
    message: "Você deve aceitar a política de privacidade e os termos de consentimento LGPD para se candidatar",
  }),
});

export type CompanyJobFormData = z.infer<typeof companyJobSchema>;
export type ApplicationSubmissionFormData = z.infer<typeof applicationSubmissionSchema>;
