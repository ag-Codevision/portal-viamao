import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/data";
import { localDate } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return {
    title:
      (await getArticle((await params).slug))?.title ?? "Texto não encontrado",
  };
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const a = await getArticle((await params).slug);
  if (!a) notFound();
  return (
    <article className="container page-content reading">
      <p className="eyebrow">
        EDITORIAL DEMONSTRATIVO · {localDate(a.publishedAt)}
      </p>
      <h1>{a.title}</h1>
      <p className="page-intro">{a.excerpt}</p>
      <Image
        src={a.coverPath}
        width={1200}
        height={675}
        alt="Ilustração conceitual de uma cidade"
        className="article-image"
      />
      <p className="muted">
        Crédito: ilustração original criada para este protótipo.
      </p>
      <p>{a.body}</p>
      <ButtonLink href="/noticias" variant="secondary">
        ← Voltar ao feed
      </ButtonLink>
    </article>
  );
}
export const dynamicParams = false;
export async function generateStaticParams() {
  const { listArticles } = await import("@/lib/data");
  return (await listArticles("viamao")).map((a) => ({ slug: a.slug }));
}
