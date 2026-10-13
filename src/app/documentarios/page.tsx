import { Catalog } from "@/components/media/catalog";
export const metadata = { title: "Documentários" };
export default async function Documentaries({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const p = await searchParams;
  return (
    <div className="container page-content">
      <p className="eyebrow">PARA VER COM OUTROS OLHOS</p>
      <h1>Documentários</h1>
      <p className="page-intro">
        Paisagens, memórias e histórias em uma coleção inteiramente fictícia.
      </p>
      <Catalog query={p.q} documentaries />
    </div>
  );
}
