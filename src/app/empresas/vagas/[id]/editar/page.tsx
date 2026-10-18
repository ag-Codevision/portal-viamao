import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Building2 } from "lucide-react";
import { jobsStore } from "@/lib/data";
import { CompanyJobForm } from "@/components/jobs/company-job-form";

export const metadata = { title: "Editar Vaga · Portal TV Viamão" };

export default async function EditJobPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ companyId?: string }>;
}) {
  const { id } = await params;
  const p = await searchParams;

  const job = await jobsStore.getJobById(id);
  if (!job) notFound();

  const companies = await jobsStore.listCompanies();
  const currentCompanyId = p.companyId || job.companyId || companies[0]?.id;
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
          EDITANDO POR: {company.name.toUpperCase()}
        </span>
        <h1>Editar Vaga: {job.title}</h1>
        <p className="page-intro">
          Atualize os requisitos, modalidade, benefícios ou perguntas para os candidatos desta oportunidade.
        </p>
      </div>

      <CompanyJobForm companyId={currentCompanyId} initialJob={job} />
    </div>
  );
}
