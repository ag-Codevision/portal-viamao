"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import type { Program } from "@/types";

export interface MediaCardProps {
  program: Program;
  onOpenInfo?: (program: Program) => void;
  variant?: "default" | "poster" | "top";
  rank?: number;
}

export function MediaCard({
  program,
  onOpenInfo,
  variant = "default",
  rank,
}: MediaCardProps) {
  const isPoster = variant === "poster" || variant === "top";

  return (
    <div
      className={`media-card-wrapper ${isPoster ? "wrapper-poster" : ""} ${
        variant === "top" ? "wrapper-top-rank" : ""
      }`}
    >
      {/* Numeral Gigante Estilizado para Top 5 */}
      {variant === "top" && typeof rank === "number" && (
        <span className="top-rank-number" aria-hidden="true">
          {rank}
        </span>
      )}

      <Link
        href={`/programas/${program.slug}`}
        className={`media-card ${isPoster ? "media-card-poster" : ""}`}
        aria-label={`${
          variant === "top" && rank ? `Top ${rank}: ` : ""
        }${program.title}, ${program.category}, ${program.durationMinutes} minutos`}
      >
        <div className={`card-image ${isPoster ? "card-image-poster" : ""}`}>
          <Image
            src={program.coverPath}
            alt={`Capa cinematográfica de ${program.title}`}
            fill
            sizes={
              isPoster
                ? "(max-width: 640px) 38vw, (max-width: 1024px) 25vw, 16vw"
                : "(max-width: 640px) 46vw, (max-width: 1024px) 40vw, 25vw"
            }
          />
          <span className="card-play" aria-hidden="true">
            <Play size={16} fill="currentColor" />
          </span>
          <span className="card-duration">{program.durationMinutes} min</span>
        </div>
        <div className="card-info">
          <p className="card-category">{program.category}</p>
          <h3>{program.title}</h3>
        </div>
      </Link>

      {onOpenInfo && (
        <button
          type="button"
          className="card-quick-info-trigger"
          aria-label={`Ver detalhes rápidos de ${program.title}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenInfo(program);
          }}
        >
          <Info size={15} />
        </button>
      )}
    </div>
  );
}
