"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import type { Program } from "@/types";

export function MediaCard({
  program,
  onOpenInfo,
}: {
  program: Program;
  onOpenInfo?: (program: Program) => void;
}) {
  return (
    <div className="media-card-wrapper">
      <Link
        href={`/programas/${program.slug}`}
        className="media-card"
        aria-label={`${program.title}, ${program.category}, ${program.durationMinutes} minutos`}
      >
        <div className="card-image">
          <Image
            src={program.coverPath}
            alt={`Capa cinematográfica de ${program.title}`}
            fill
            sizes="(max-width: 640px) 44vw, (max-width: 1024px) 40vw, 25vw"
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
