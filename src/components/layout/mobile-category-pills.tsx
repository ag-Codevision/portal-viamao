"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface CategoryPill {
  href: string;
  label: string;
  isLive?: boolean;
}

const PILLS: CategoryPill[] = [
  { href: "/", label: "Tudo" },
  { href: "/ao-vivo", label: "Ao Vivo", isLive: true },
  { href: "/programas", label: "Programas" },
  { href: "/documentarios", label: "Documentários" },
  { href: "/noticias", label: "Notícias" },
  { href: "/empregos", label: "Oportunidades" },
];

export function MobileCategoryPills() {
  const pathname = usePathname();

  return (
    <div
      className="mobile-pills-bar"
      role="region"
      aria-label="Filtros rápidos por categoria"
    >
      <div className="mobile-pills-scroll">
        {PILLS.map((pill) => {
          const isSelected =
            pill.href === "/" ? pathname === "/" : pathname.startsWith(pill.href);

          return (
            <Link
              key={pill.href}
              href={pill.href}
              className={`mobile-pill ${isSelected ? "selected" : ""}`}
              aria-current={isSelected ? "page" : undefined}
            >
              {pill.isLive && (
                <span className="mobile-pill-live-dot" aria-hidden="true" />
              )}
              {pill.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
