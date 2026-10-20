"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Menu, Search, X, Play } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { siteConfig } from "@/lib/config";
import { MobileCategoryPills } from "./mobile-category-pills";
import { GlobalSearchModal } from "./global-search-modal";

const links = [
  ["/", "Início"],
  ["/ao-vivo", "Ao vivo"],
  ["/programas", "Programas"],
  ["/documentarios", "Documentários"],
  ["/noticias", "Notícias"],
  ["/empregos", "Oportunidades"],
];

const METRO_CITIES = [
  { slug: "viamao", name: "Viamão, RS" },
  { slug: "porto-alegre", name: "Porto Alegre, RS" },
  { slug: "alvorada", name: "Alvorada, RS" },
  { slug: "cachoeirinha", name: "Cachoeirinha, RS" },
  { slug: "canoas", name: "Canoas, RS" },
  { slug: "gravatai", name: "Gravataí, RS" },
  { slug: "esteio", name: "Esteio, RS" },
  { slug: "sapucaia", name: "Sapucaia do Sul, RS" },
  { slug: "sao-leopoldo", name: "São Leopoldo, RS" },
  { slug: "novo-hamburgo", name: "Novo Hamburgo, RS" },
  { slug: "guaiba", name: "Guaíba, RS" },
  { slug: "eldorado", name: "Eldorado do Sul, RS" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [selectedCity, setSelectedCity] = useState("viamao");
  const toggle = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastScrollY = useRef(0);

  const isLivePage = pathname === "/ao-vivo";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 25);

      // Auto-hide no mobile apenas quando o menu modal não estiver aberto
      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollY.current + 8) {
          setIsHidden(true);
        } else if (currentScrollY < lastScrollY.current - 4) {
          setIsHidden(false);
        }
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`site-header ${isScrolled ? "scrolled" : ""} ${
          isHidden && !open ? "header-hidden" : "header-visible"
        }`}
      >
        <div className="header-inner">
          <Link
            href="/"
            className="brand"
            aria-label={`${siteConfig.name}, início`}
            onClick={handleLogoClick}
          >
            <img
              src="/logo.png"
              alt="Portal TV Viamão"
              className="brand-logo-img"
            />
          </Link>
          <nav className="desktop-nav" aria-label="Navegação principal">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  pathname === href ||
                  (href !== "/" && pathname.startsWith(`${href}/`))
                    ? "page"
                    : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            {/* Seletor de Cidades da Grande Porto Alegre */}
            <div className="city-selector-wrap" title="Selecionar cidade da Região Metropolitana">
              <MapPin size={14} className="city-selector-pin" aria-hidden="true" />
              <select
                id="city-select"
                aria-label="Cidades da Grande Porto Alegre"
                className="city-selector-dropdown"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {METRO_CITIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Lupa de Busca Geral da Plataforma */}
            <button
              type="button"
              className="icon-button header-search-trigger"
              aria-label="Buscar na plataforma"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={20} />
            </button>

            {!isLivePage && (
              <Link href="/ao-vivo" className="header-live">
                <span className="live-dot-pulse" aria-hidden="true" />
                <Play size={13} fill="currentColor" /> Assistir à TV
              </Link>
            )}
            <button
              ref={toggle}
              className="icon-button menu-toggle"
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </button>
          </div>
        </div>
        <MobileCategoryPills />
        <dialog
          ref={dialog}
          id="mobile-menu"
          className="mobile-menu"
          onCancel={() => setOpen(false)}
          onClose={() => {
            setOpen(false);
            toggle.current?.focus();
          }}
        >
          <div className="menu-heading">
            <span>Explore o portal</span>
            <button
              className="icon-button"
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>
          <nav aria-label="Navegação móvel">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </nav>
          <p>
            Feito para Viamão e Região Metropolitana.
            <br />
            Protótipo com conteúdo demonstrativo.
          </p>
        </dialog>
      </header>

      {/* Modal de Busca Global */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
