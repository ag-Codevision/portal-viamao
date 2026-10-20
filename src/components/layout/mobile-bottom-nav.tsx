"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radio, Tv, Search, Briefcase } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  isLive?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/ao-vivo", label: "Ao Vivo", icon: Radio, isLive: true },
  { href: "/programas", label: "Programas", icon: Tv },
  { href: "/busca", label: "Busca", icon: Search },
  { href: "/empregos", label: "Oportunidades", icon: Briefcase },
];

export function MobileBottomNav({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/busca")) return pathname === "/busca";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Navegação móvel principal"
    >
      <div className="mobile-bottom-nav-inner">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          if (item.href === "/busca" && onOpenSearch) {
            return (
              <button
                key={item.href}
                type="button"
                className={`mobile-nav-item ${active ? "active" : ""}`}
                aria-label="Buscar na plataforma"
                onClick={onOpenSearch}
              >
                <div className="mobile-nav-icon-wrap">
                  <Icon size={21} strokeWidth={active ? 2.5 : 1.9} />
                </div>
                <span className="mobile-nav-label">{item.label}</span>
                {active && (
                  <span className="mobile-nav-active-pill" aria-hidden="true" />
                )}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <div className="mobile-nav-icon-wrap">
                <Icon size={21} strokeWidth={active ? 2.5 : 1.9} />
                {item.isLive && (
                  <span
                    className="mobile-nav-live-dot"
                    aria-label="Canal ao vivo"
                  />
                )}
              </div>
              <span className="mobile-nav-label">{item.label}</span>
              {active && (
                <span className="mobile-nav-active-pill" aria-hidden="true" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
