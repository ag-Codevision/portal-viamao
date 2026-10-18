"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, X, ArrowRight, Clock, Tag } from "lucide-react";

export interface QuickInfoItem {
  id: string;
  title: string;
  synopsis: string;
  category?: string;
  duration?: string;
  coverPath: string;
  watchHref: string;
  detailsHref: string;
  badge?: string;
}

interface QuickInfoSheetProps {
  item: QuickInfoItem | null;
  onClose: () => void;
}

export function QuickInfoSheet({ item, onClose }: QuickInfoSheetProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!item) return;

    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="quick-info-backdrop"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="quick-info-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-info-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quick-info-handle" aria-hidden="true" />

        <div className="quick-info-media">
          <Image
            src={item.coverPath}
            alt={item.title}
            fill
            className="quick-info-img"
            sizes="(max-width: 640px) 100vw, 420px"
          />
          <div className="quick-info-media-shade" aria-hidden="true" />
          <button
            ref={closeBtnRef}
            type="button"
            className="quick-info-close"
            onClick={onClose}
            aria-label="Fechar prévia"
          >
            <X size={20} />
          </button>
          {item.badge && (
            <span className="quick-info-badge">{item.badge}</span>
          )}
        </div>

        <div className="quick-info-body">
          <h3 id="quick-info-title" className="quick-info-title">
            {item.title}
          </h3>

          <div className="quick-info-meta">
            {item.category && (
              <span className="quick-info-meta-pill">
                <Tag size={12} /> {item.category}
              </span>
            )}
            {item.duration && (
              <span className="quick-info-meta-pill">
                <Clock size={12} /> {item.duration}
              </span>
            )}
            <span className="quick-info-hd-tag">HD</span>
          </div>

          <div className="quick-info-actions">
            <Link
              href={item.watchHref}
              className="button button-primary quick-info-btn-play"
              onClick={onClose}
            >
              <Play size={18} fill="currentColor" /> Assistir agora
            </Link>
            <Link
              href={item.detailsHref}
              className="button button-secondary quick-info-btn-details"
              onClick={onClose}
            >
              Ver detalhes <ArrowRight size={16} />
            </Link>
          </div>

          <p className="quick-info-synopsis">{item.synopsis}</p>
        </div>
      </div>
    </div>
  );
}
