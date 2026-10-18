import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight, Radio, Sparkles } from "lucide-react";
import { getHomeFeed } from "@/lib/data";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/states";
import { MediaRail } from "@/components/media/media-rail";
import { JobCard } from "@/components/jobs/job-card";
import { OpenVideoCollection } from "@/components/media/open-video-collection";
import { HeroSlider } from "@/components/media/hero-slider";

export default async function Home() {
  const feed = await getHomeFeed();
  return (
    <>
      <HeroSlider />

      <div className="container">
        <div className="demo-notice">
          VERSÃO DEMONSTRATIVA{" "}
          <span>
            Produções locais e vagas fictícias. Filmes de licença aberta e TV
            Câmara disponíveis separadamente.
          </span>
        </div>
        <section className="live-strip" aria-labelledby="tv-title">
          <div className="live-mark">
            <Radio size={24} />
            <span>
              CANAL
              <br />
              PÚBLICO
            </span>
          </div>
          <div>
            <p className="eyebrow">SINAL EXTERNO OFICIAL</p>
            <h2 id="tv-title">TV do mundo</h2>
            <p>Escolha canais por país, estado e cidade</p>
          </div>
          <div className="up-next">
            <span className="eyebrow">TV LOCAL DE VIAMÃO</span>
            <p>Permanece em demonstração</p>
          </div>
          <ButtonLink variant="default" href="/ao-vivo">
            <Play size={16} fill="currentColor" /> Explorar canais
          </ButtonLink>
        </section>
        <section className="home-section">
          <SectionHeading
            kicker="SEU LUGAR. SUAS HISTÓRIAS."
            title="Descubra Viamão"
            href="/programas"
          />
          <MediaRail programs={feed.programs} label="Descubra Viamão" />
        </section>
        <OpenVideoCollection />
        <section className="editorial-feature">
          <div className="feature-art">
            <Image
              src="/images/feature-people.jpg"
              alt="Histórias reais da comunidade de Viamão: pessoas, encontros e memórias locais"
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            <div className="feature-art-shade" aria-hidden="true" />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">HISTÓRIAS DE VIAMÃO · DEMONSTRAÇÃO</p>
            <h2>
              O extraordinário
              <br />
              mora perto.
            </h2>
            <p>
              Gente que cria, cuida e faz a cidade acontecer. Um espaço para as
              histórias que merecem ser contadas.
            </p>
            <ButtonLink href="/programas/gente-daqui" variant="secondary">
              Conheça Gente daqui <ArrowRight size={16} />
            </ButtonLink>
          </div>
        </section>
        <section className="home-section">
          <SectionHeading
            kicker="UM TEMPO PARA OLHAR MAIS LONGE"
            title="Documentários"
            href="/documentarios"
          />
          <MediaRail
            programs={feed.programs.filter(
              (p) => p.category === "Documentários",
            )}
            label="Documentários"
          />
        </section>
        <section className="home-section jobs-preview" aria-labelledby="jobs-home-title">
          <div className="jobs-section-header">
            <div>
              <span className="eyebrow-badge">
                <Sparkles size={13} aria-hidden="true" />
                SERVIÇOS PARA A COMUNIDADE · GRATUITO
              </span>
              <h2 id="jobs-home-title" className="jobs-section-title">
                Oportunidades em Viamão
              </h2>
              <p className="jobs-section-subtitle">
                Conectando trabalhadores, comércio local e pequenas empresas da nossa cidade. Vagas 100% locais e sem intermediários.
              </p>
            </div>
            <div className="jobs-header-actions">
              <ButtonLink variant="secondary" href="/empregos">
                Ver todas as vagas <ArrowRight size={16} />
              </ButtonLink>
            </div>
          </div>

          <div className="job-quick-pills">
            <span className="quick-pill-label">Destaques por região:</span>
            <Link href="/empregos?q=Centro" className="quick-pill">📍 Centro</Link>
            <Link href="/empregos?q=Santa+Isabel" className="quick-pill">📍 Santa Isabel</Link>
            <Link href="/empregos?q=Viamópolis" className="quick-pill">📍 Viamópolis</Link>
            <Link href="/empregos?area=Comércio" className="quick-pill">🛍️ Comércio</Link>
            <Link href="/empregos?area=Administrativo" className="quick-pill">💼 Administrativo</Link>
          </div>

          <div className="job-grid">
            {feed.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          <div className="jobs-community-callout">
            <div className="callout-content">
              <span className="callout-badge">PARA COMERCIANTES & EMPREENDEDORES LOCAIS</span>
              <h4>Tem uma vaga aberta no seu comércio ou empresa em Viamão?</h4>
              <p>
                Divulgue oportunidades gratuitamente para a comunidade. O portal não cobra taxas e direciona o contato diretamente para o seu negócio.
              </p>
            </div>
            <ButtonLink variant="default" href="/empregos/publicar">
              Divulgar vaga grátis ↗
            </ButtonLink>
          </div>
        </section>
        <section className="home-section">
          <SectionHeading
            kicker="DA REDAÇÃO"
            title="Por dentro do portal"
            href="/noticias"
          />
          <Link
            className="news-teaser"
            href={`/noticias/${feed.articles[0].slug}`}
          >
            <span className="eyebrow">EDITORIAL DEMONSTRATIVO</span>
            <h3>{feed.articles[0].title}</h3>
            <p>
              {feed.articles[0].excerpt} <ArrowRight size={17} />
            </p>
          </Link>
        </section>
      </div>
    </>
  );
}
