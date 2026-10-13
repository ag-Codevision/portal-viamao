"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight, MapPin, ChevronLeft, ChevronRight, Pause } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export interface HeroSlideData {
  id: string;
  slug: string;
  eyebrow: string;
  titleMain: string;
  titleAccent: string;
  description: string;
  category: string;
  duration: string;
  tag: string;
  location: string;
  coverPath: string;
  watchHref: string;
  detailsHref: string;
}

export const HERO_SLIDES: HeroSlideData[] = [
  {
    id: "slide-1",
    slug: "entre-aguas",
    eyebrow: "DESTAQUE DA SEMANA • ORIGINAL",
    titleMain: "Entre águas",
    titleAccent: "e histórias.",
    description:
      "Um novo olhar sobre o lugar que chamamos de casa. Descubra as paisagens exuberantes, as memórias e as vozes do Parque Estadual de Itapuã e das margens de Viamão.",
    category: "DOCUMENTÁRIO",
    duration: "42 MIN",
    tag: "CONTEÚDO FICTÍCIO",
    location: "Parque Estadual de Itapuã · Viamão/RS",
    coverPath: "/images/hero/slide-1-entre-aguas.jpg",
    watchHref: "/assistir/entre-aguas-1",
    detailsHref: "/programas/entre-aguas",
  },
  {
    id: "slide-2",
    slug: "viamao-em-pauta",
    eyebrow: "JORNALISMO • REDAÇÃO AO VIVO",
    titleMain: "Viamão",
    titleAccent: "em pauta.",
    description:
      "A verdade dos fatos, o debate comunitário e o cotidiano da cidade em uma cobertura jornalística independente com espaço para ouvir a comunidade.",
    category: "JORNALISMO",
    duration: "30 MIN",
    tag: "EDIÇÃO DIÁRIA",
    location: "Redação Central · Viamão/RS",
    coverPath: "/images/hero/slide-2-viamao-pauta.jpg",
    watchHref: "/assistir/viamao-em-pauta-1",
    detailsHref: "/programas/viamao-em-pauta",
  },
  {
    id: "slide-3",
    slug: "gente-daqui",
    eyebrow: "HISTÓRIAS DE VIAMÃO • SÉRIE ORIGINAL",
    titleMain: "Gente",
    titleAccent: "daqui.",
    description:
      "O extraordinário mora perto. Encontros intimistas com personalidades, artistas e moradores que transformam pequenos gestos na grande história de Viamão.",
    category: "HISTÓRIAS LOCAIS",
    duration: "24 MIN",
    tag: "PRODUÇÃO REGIONAL",
    location: "Santa Isabel e Região · Viamão/RS",
    coverPath: "/images/hero/slide-3-gente-daqui.jpg",
    watchHref: "/assistir/gente-daqui-1",
    detailsHref: "/programas/gente-daqui",
  },
  {
    id: "slide-4",
    slug: "sabores-da-nossa-terra",
    eyebrow: "CULTURA & GASTRONOMIA • ROTA TRADICIONAL",
    titleMain: "Sabores da",
    titleAccent: "nossa terra.",
    description:
      "O calor do fogão a lenha, o afeto do café colonial e as receitas passadas de geração em geração pelas famílias e produtores rurais do sul.",
    category: "CULTURA",
    duration: "28 MIN",
    tag: "TRADIÇÃO GAÚCHA",
    location: "Rota Rural dos Sabores · Viamão/RS",
    coverPath: "/images/hero/slide-4-sabores-terra.jpg",
    watchHref: "/assistir/sabores-da-nossa-terra-1",
    detailsHref: "/programas/sabores-da-nossa-terra",
  },
  {
    id: "slide-5",
    slug: "caminhos-do-sul",
    eyebrow: "EXPEDIÇÃO • NATUREZA & PRESERVAÇÃO",
    titleMain: "Caminhos",
    titleAccent: "do sul.",
    description:
      "Um olhar poético e cinematográfico sobre a fauna, as coxilhas e os caminhos ecológicos preservados no coração do nosso território.",
    category: "DOCUMENTÁRIO",
    duration: "36 MIN",
    tag: "BIODIVERSIDADE",
    location: "Morros e Coxilhas · Viamão/RS",
    coverPath: "/images/hero/slide-5-caminhos-sul.jpg",
    watchHref: "/assistir/caminhos-do-sul-1",
    detailsHref: "/programas/caminhos-do-sul",
  },
  {
    id: "slide-6",
    slug: "palco-aberto",
    eyebrow: "ARTE & ENTRETENIMENTO • MÚSICA AO VIVO",
    titleMain: "Palco",
    titleAccent: "aberto.",
    description:
      "Os acordes da música regional, a força da cultura nativista e novos talentos em apresentações exclusivas com acústica e iluminação de espetáculo.",
    category: "CULTURA",
    duration: "22 MIN",
    tag: "ESPETÁCULO MUSICAL",
    location: "Teatro e Espaço Cultural · Viamão/RS",
    coverPath: "/images/hero/slide-6-palco-aberto.jpg",
    watchHref: "/assistir/palco-aberto-1",
    detailsHref: "/programas/palco-aberto",
  },
];

export function HeroSlider({ slides = HERO_SLIDES }: { slides?: HeroSlideData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const touchStartX = useRef<number | null>(null);

  const total = slides.length;
  const currentSlide = slides[currentIndex] || slides[0];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Autoplay com pausa se isPlaying for falso
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, currentIndex]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  return (
    <section
      className="editorial-hero hero-netflix-slider"
      aria-roledescription="carousel"
      aria-label="Destaques em vídeo do Portal TV Viamão"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (diff > 50) nextSlide();
        if (diff < -50) prevSlide();
        touchStartX.current = null;
      }}
    >
      {/* Camada das 6 Imagens com Transição Suave (Cross-fade) */}
      <div className="hero-slides-layer" aria-hidden="true">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`hero-slide-backdrop ${isActive ? "active" : ""}`}
            >
              <Image
                src={slide.coverPath}
                alt={`Imagem de capa do destaque ${slide.titleMain} ${slide.titleAccent}`}
                fill
                priority={index === 0}
                sizes="100vw"
                quality={85}
              />
            </div>
          );
        })}
      </div>

      {/* Gradientes cinematográficos estilo Netflix */}
      <div className="hero-shade hero-shade-netflix" />

      {/* Conteúdo textual do Slide Ativo */}
      <div className="hero-content container" key={currentSlide.id}>
        <p className="eyebrow hero-fade-item">
          <span className="gold-line" /> {currentSlide.eyebrow}
        </p>

        <h1 className="hero-fade-item">
          {currentSlide.titleMain}
          <br />
          {currentSlide.titleAccent.replace(/\.$/, "")}
          <span>.</span>
        </h1>

        <p className="hero-description hero-fade-item">
          {currentSlide.description}
        </p>

        <p className="hero-meta hero-fade-item">
          {currentSlide.category} <span>•</span> {currentSlide.duration}{" "}
          <span>•</span> {currentSlide.tag}
        </p>

        <div className="hero-buttons hero-fade-item">
          <ButtonLink href={currentSlide.watchHref}>
            <Play size={17} fill="currentColor" /> Assistir agora
          </ButtonLink>
          <ButtonLink href={currentSlide.detailsHref} variant="secondary">
            Ver detalhes <ArrowRight size={17} />
          </ButtonLink>
        </div>

        <p className="hero-caption hero-fade-item">
          <MapPin size={13} /> {currentSlide.location}
        </p>
      </div>

      {/* Setas de Navegação Laterais Netflix */}
      <button
        type="button"
        className="hero-nav-btn hero-nav-prev"
        onClick={prevSlide}
        aria-label="Ver slide anterior"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        type="button"
        className="hero-nav-btn hero-nav-next"
        onClick={nextSlide}
        aria-label="Ver próximo slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Painel Inferior de Controles dos 6 Slides */}
      <div className="hero-controls-bar">
        {/* Marcadores / Pílulas clicáveis para os 6 slides */}
        <div className="hero-thumbs" role="tablist" aria-label="Navegar entre os 6 slides">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                role="tab"
                aria-selected={isActive}
                aria-label={`Slide ${idx + 1}: ${slide.titleMain} ${slide.titleAccent}`}
                className={`hero-thumb-btn ${isActive ? "active" : ""}`}
                onClick={() => goToSlide(idx)}
              >
                <span className="hero-thumb-num">{`0${idx + 1}`}</span>
                <span className="hero-thumb-title">{slide.titleMain}</span>
                <span className="hero-thumb-progress">
                  <span className={`hero-thumb-fill ${isActive && isPlaying ? "animating" : ""}`} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Indicador Numérico e Botão de Pausar */}
        <div className="hero-status-group">
          <button
            type="button"
            className="hero-pause-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pausar rotação automática" : "Retomar rotação automática"}
            title={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
          </button>
          <div className="hero-index" aria-hidden="true">
            {`0${currentIndex + 1}`} <span>{`/ 0${total}`}</span>
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}
