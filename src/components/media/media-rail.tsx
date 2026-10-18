"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Program } from "@/types";
import { MediaCard } from "./media-card";
import { QuickInfoSheet, type QuickInfoItem } from "./quick-info-sheet";

export function MediaRail({
  programs,
  label,
}: {
  programs: Program[];
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<QuickInfoItem | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!ref.current) return;
    const distance = Math.round(ref.current.clientWidth * 0.75);
    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: isReduced ? "instant" : "smooth",
    });
  };

  const handleOpenInfo = (program: Program) => {
    setActiveItem({
      id: program.id,
      title: program.title,
      synopsis: program.synopsis,
      category: program.category,
      duration: `${program.durationMinutes} min`,
      coverPath: program.coverPath,
      watchHref: `/assistir/${program.slug}-1`,
      detailsHref: `/programas/${program.slug}`,
      badge: "VIAMÃO • ORIGINAL",
    });
  };

  return (
    <>
      <div className="rail-wrapper" aria-label={`Trilho de catálogo: ${label}`}>
        <button
          type="button"
          className="rail-arrow rail-arrow-left"
          aria-label={`Rolar ${label} para a esquerda`}
          onClick={() => scroll("left")}
        >
          <ChevronLeft size={28} />
        </button>

        <div className="media-rail" ref={ref} aria-label={label}>
          {programs.map((p) => (
            <MediaCard
              key={p.id}
              program={p}
              onOpenInfo={handleOpenInfo}
            />
          ))}
        </div>

        <button
          type="button"
          className="rail-arrow rail-arrow-right"
          aria-label={`Rolar ${label} para a direita`}
          onClick={() => scroll("right")}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <QuickInfoSheet
        item={activeItem}
        onClose={() => setActiveItem(null)}
      />
    </>
  );
}
