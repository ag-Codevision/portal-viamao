"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Building2, ChevronDown, ShieldCheck } from "lucide-react";
import type { Company } from "@/types";

interface CompanySwitcherProps {
  companies: Company[];
  selectedCompanyId: string;
}

export function CompanySwitcher({ companies, selectedCompanyId }: CompanySwitcherProps) {
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newCompanyId = e.target.value;
    router.push(`/empresas/vagas?companyId=${newCompanyId}`);
  }

  const current = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  return (
    <div className="company-switcher-card">
      <div className="switcher-info">
        <Building2 size={20} className="text-amber" aria-hidden="true" />
        <div>
          <span className="switcher-eyebrow">EMPRESA CONECTADA (SESSÃO MULTI-TENANT):</span>
          <strong>{current?.name}</strong>
          <span className="switcher-plan-badge">
            <ShieldCheck size={12} /> Plano {current?.planType?.toUpperCase() || "ANUNCIANTE"}
          </span>
        </div>
      </div>

      <div className="switcher-select-wrap">
        <label htmlFor="company-select" className="sr-only">
          Alternar Empresa para Demonstração
        </label>
        <select
          id="company-select"
          className="company-select-input"
          value={selectedCompanyId}
          onChange={handleChange}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.planType})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
