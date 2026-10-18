import Link from "next/link";
import { ArrowLeft, Sparkles, Building2 } from "lucide-react";
import { jobsStore } from "@/lib/data";
import { CompanyJobForm } from "@/components/jobs/company-job-form";

export const metadata = { title: "Publicar Nova Vaga · Portal TV Viamão" };

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const p = await searchParams;
  const companies = await jobsStore.listCompanies();
  const currentCompanyId = p.companyId || companies[0]?.id || "company-0";
  const company = (await jobsStore.getCompany(currentCompanyId)) || companies[0];

  return (
    <div className="container page-content editor-page-wrapper">
      <Link
        href={`/empresas/vagas?companyId=${currentCompanyId}`}
        className="back-link-action"
      >
        <ArrowLeft size={16} /> Voltar para o Painel de Vagas
      </Link>

      <div className="editor-page-header">
        <span className="eyebrow-badge">
          <Sparkles size={12} aria-hidden="true" />
          PUBLICANDO POR: {company.name.toUpperCase()}
        </span>
        <h1>Cadastrar Nova Oportunidade</h1>
        <p className="page-intro">
          Preencha as informações da vaga para disponibilizá-la aos profissionais e moradores de Viamão.
        </p>
      </div>

      <CompanyJobForm companyId={currentCompanyId} />
    </div>
  );
}
