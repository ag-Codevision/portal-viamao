import { z } from "zod";
export const jobSubmissionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Informe um título com pelo menos 5 caracteres.")
    .max(100),
  company: z.string().trim().min(2, "Informe o nome da empresa.").max(100),
  email: z.email("Informe um e-mail válido."),
  description: z
    .string()
    .trim()
    .min(30, "Descreva a vaga com pelo menos 30 caracteres.")
    .max(3000),
  workMode: z.enum(["Presencial", "Híbrido", "Remoto"]),
  consent: z.literal(true, {
    error: "Confirme que entendeu o caráter demonstrativo.",
  }),
});
