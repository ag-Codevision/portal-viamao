"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Film, Tv, Radio, Briefcase, Newspaper, ArrowRight, Loader2 } from "lucide-react";
import type { SearchItem } from "@/lib/data/global-search";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.items ?? []);
        }
      } catch (err) {
        // silencioso
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  const popular = [
    "Entre Águas",
    "TV Câmara",
    "Gente Daqui",
    "Documentários",
    "Oportunidades",
    "Méliès",
  ];

  return (
    <div
      className="global-search-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Busca global da plataforma"
    >
      <div
        className="global-search-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="modal-search-form">
          <Search size={20} className="modal-search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar programas, filmes, canais, notícias ou vagas…"
            className="modal-search-input"
            aria-label="Digitar termo de busca"
          />
          {isLoading && <Loader2 size={18} className="modal-search-spinner animate-spin" />}
          {query && !isLoading && (
            <button
              type="button"
              className="modal-search-clear"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            className="modal-search-close-btn"
            onClick={onClose}
            aria-label="Fechar busca"
          >
            Esc
          </button>
        </form>

        <div className="modal-search-body">
          {!query.trim() && (
            <div className="modal-search-suggestions">
              <span className="suggestions-title">Sugestões populares em Viamão:</span>
              <div className="suggestions-pills">
                {popular.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="suggestion-pill"
                    onClick={() => setQuery(term)}
                  >
                    <Search size={12} /> {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && results.length > 0 && (
            <div className="modal-search-results">
              <span className="results-count-badge">
                {results.length} {results.length === 1 ? "resultado" : "resultados"}:
              </span>
              <ul className="modal-results-list" role="listbox">
                {results.map((item) => (
                  <li key={`${item.type}-${item.id}`} className="modal-result-item">
                    <Link
                      href={item.url}
                      onClick={onClose}
                      className="modal-result-link"
                    >
                      <div className="modal-result-icon" aria-hidden="true">
                        {item.type === "program" && <Tv size={16} />}
                        {item.type === "video" && <Film size={16} />}
                        {item.type === "live" && <Radio size={16} />}
                        {item.type === "job" && <Briefcase size={16} />}
                        {item.type === "article" && <Newspaper size={16} />}
                      </div>
                      <div className="modal-result-info">
                        <strong className="modal-result-title">{item.title}</strong>
                        <span className="modal-result-sub">{item.subtitle}</span>
                      </div>
                      <span className="modal-result-tag">{item.badge}</span>
                      <ArrowRight size={14} className="modal-result-arrow" />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="modal-view-all-row">
                <Link
                  href={`/busca?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="modal-view-all-link"
                >
                  Ver todos os resultados na página completa de busca →
                </Link>
              </div>
            </div>
          )}

          {query.trim() && !isLoading && results.length === 0 && (
            <div className="modal-no-results">
              <p>Nenhum conteúdo encontrado para <strong>"{query}"</strong>.</p>
              <span>Tente palavras mais genéricas ou explore os programas do portal.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
