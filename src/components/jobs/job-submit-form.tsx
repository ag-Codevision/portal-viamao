"use client";
import { useState } from "react";
import { jobSubmissionSchema } from "@/lib/validation/job";
import { Button } from "@/components/ui/button";
export function JobSubmitForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = jobSubmissionSchema.safeParse({
      ...Object.fromEntries(data),
      consent: data.get("consent") === "on",
    });
    if (!result.success) {
      setErrors(
        Object.fromEntries(
          result.error.issues.map((i) => [String(i.path[0]), i.message]),
        ),
      );
      const first = event.currentTarget.elements.namedItem(
        String(result.error.issues[0].path[0]),
      );
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    setErrors({});
    setState("loading");
    await new Promise((resolve) => setTimeout(resolve, 400));
    setState("success");
  }
  if (state === "success")
    return (
      <div className="success-state" role="status">
        <h2>Simulação concluída</h2>
        <p>
          Os dados passaram pela validação local. Nada foi enviado, armazenado
          ou publicado. No portal real, a vaga será analisada antes de aparecer.
        </p>
        <Button variant="secondary" onClick={() => setState("idle")}>
          Simular outra vaga
        </Button>
      </div>
    );
  return (
    <form className="job-form" onSubmit={submit} noValidate>
      <p className="notice">
        Use dados fictícios. Este formulário apenas demonstra a validação no
        navegador.
      </p>
      {[
        ["title", "Título da vaga", "text"],
        ["company", "Empresa fictícia", "text"],
        ["email", "E-mail de exemplo", "email"],
      ].map(([name, label, type]) => (
        <label key={name} htmlFor={name}>
          {label}
          <input
            id={name}
            name={name}
            type={type}
            autoComplete="off"
            spellCheck={type !== "email"}
            required
            maxLength={100}
            aria-invalid={!!errors[name]}
            aria-describedby={errors[name] ? `${name}-error` : undefined}
          />
          {errors[name] && (
            <span id={`${name}-error`} className="field-error">
              {errors[name]}
            </span>
          )}
        </label>
      ))}
      <label htmlFor="workMode">
        Modalidade
        <select id="workMode" name="workMode">
          <option>Presencial</option>
          <option>Híbrido</option>
          <option>Remoto</option>
        </select>
      </label>
      <label htmlFor="description">
        Descrição e requisitos
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          maxLength={3000}
          aria-invalid={!!errors.description}
          aria-describedby={
            errors.description ? "description-error" : undefined
          }
        />
        {errors.description && (
          <span id="description-error" className="field-error">
            {errors.description}
          </span>
        )}
      </label>
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="consent"
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "consent-error" : undefined}
        />{" "}
        Entendo que esta é uma demonstração sem envio real.
      </label>
      {errors.consent && (
        <p id="consent-error" className="field-error">
          {errors.consent}
        </p>
      )}
      {Object.keys(errors).length > 0 && (
        <p role="alert">Revise os campos indicados antes de continuar.</p>
      )}
      <Button disabled={state === "loading"} type="submit">
        {state === "loading" ? "Validando…" : "Simular envio gratuito"}
      </Button>
    </form>
  );
}
