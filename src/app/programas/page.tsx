import { Catalog } from "@/components/media/catalog";
export const metadata = { title: "Programas" };
export default async function Programs({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const p = await searchParams;
  return (
    <div className="container page-content">
      <p className="eyebrow">O MELHOR DAQUI, NO SEU TEMPO</p>
      <h1>Todos os olhares.</h1>
      <p className="page-intro">
        Explore programas locais demonstrativos e filmes reais com licença
        aberta.
      </p>
      <Catalog query={p.q} category={p.categoria} />
    </div>
  );
}
