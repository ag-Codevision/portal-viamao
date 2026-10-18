"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Program } from "@/types";
import { MediaCard } from "./media-card";
export function MediaRail({
  programs,
  label,
}: {
  programs: Program[];
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
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
          <MediaCard key={p.id} program={p} />
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
  );
}
