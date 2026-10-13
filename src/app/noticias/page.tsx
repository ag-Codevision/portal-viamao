import Link from "next/link";
import { listArticles } from "@/lib/data";
import { localDate } from "@/lib/utils";
export const metadata = { title: "Notícias" };
export default async function News() {
  const articles = await listArticles("viamao");
  return (
    <div className="container page-content">
      <p className="eyebrow">UM ESPAÇO PARA A INFORMAÇÃO LOCAL</p>
      <h1>Por dentro de Viamão.</h1>
      <p className="page-intro">
        Feed demonstrativo. Os textos abaixo não são notícias reais.
      </p>
      {articles.map((a) => (
        <Link className="news-teaser" key={a.id} href={`/noticias/${a.slug}`}>
          <span className="eyebrow">
            EDITORIAL FICTÍCIO · {localDate(a.publishedAt)}
          </span>
          <h2>{a.title}</h2>
          <p>{a.excerpt} ↗</p>
        </Link>
      ))}
    </div>
  );
}
