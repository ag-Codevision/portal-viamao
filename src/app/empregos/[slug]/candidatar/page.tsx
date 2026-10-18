import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Building2 } from "lucide-react";
import { getJob, getCompany } from "@/lib/data";
import { JobApplicationForm } from "@/components/jobs/job-application-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const j = await getJob(slug);
  return {
    title: j ? `Candidatura: ${j.title} · Portal TV Viamão` : "Vaga não encontrada",
  };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const job = await getJob(slug);
  if (!job) notFound();

  return (
    <div className="container page-content application-page-wrapper">
      <Link href={`/empregos/${job.slug}`} className="back-link-action">
        <ArrowLeft size={16} /> Voltar para os Detalhes da Vaga
      </Link>

      <div className="application-page-header">
        <span className="eyebrow-badge">
          <Sparkles size={12} aria-hidden="true" /> FORMULÁRIO DE CANDIDATURA
        </span>
        <h1>Envie sua Candidatura</h1>
        <p className="page-intro">
          Preencha suas informações com atenção. Seus dados serão entregues de forma segura diretamente para a equipe de recrutamento.
        </p>
      </div>

      <JobApplicationForm job={job} />
    </div>
  );
}
