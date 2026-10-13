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
  return (
    <div>
      <div className="rail-controls">
        <button
          className="icon-button"
          aria-label={`Rolar ${label} para a esquerda`}
          onClick={() =>
            ref.current?.scrollBy({
              left: -350,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            })
          }
        >
          <ChevronLeft />
        </button>
        <button
          className="icon-button"
          aria-label={`Rolar ${label} para a direita`}
          onClick={() =>
            ref.current?.scrollBy({
              left: 350,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            })
          }
        >
          <ChevronRight />
        </button>
      </div>
      <div className="media-rail" ref={ref} aria-label={label}>
        {programs.map((p) => (
          <MediaCard key={p.id} program={p} />
        ))}
      </div>
    </div>
  );
}
