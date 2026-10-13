import { JobSubmitForm } from "@/components/jobs/job-submit-form";
export const metadata = { title: "Simular publicação de vaga" };
export default function Publish() {
  return (
    <div className="container page-content reading">
      <p className="eyebrow">PUBLICAÇÃO GRATUITA · DEMONSTRAÇÃO</p>
      <h1>Conecte oportunidades.</h1>
      <p className="page-intro">
        Explore como será o envio de uma vaga para análise editorial. Esta etapa
        não envia dados e não publica anúncios.
      </p>
      <JobSubmitForm />
    </div>
  );
}
