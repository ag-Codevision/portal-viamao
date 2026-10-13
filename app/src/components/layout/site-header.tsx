"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Menu, Search, X, Play } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { siteConfig } from "@/lib/config";
const links = [
  ["/", "Início"],
  ["/ao-vivo", "Ao vivo"],
  ["/programas", "Programas"],
  ["/documentarios", "Documentários"],
  ["/noticias", "Notícias"],
  ["/empregos", "Empregos"],
];
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link
          href="/"
          className="brand"
          aria-label={`${siteConfig.name}, início`}
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
          <span className="city-label">
            <MapPin size={14} /> Viamão, RS
          </span>
          <Link
            href="/programas#busca"
            className="icon-button"
            aria-label="Buscar programas"
          >
            <Search size={20} />
          </Link>
          <Link href="/ao-vivo" className="header-live">
            <Play size={14} /> Assistir à TV
          </Link>
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
          Feito para Viamão.
          <br />
          Protótipo com conteúdo demonstrativo.
        </p>
      </dialog>
    </header>
  );
}
