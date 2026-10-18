import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  Banknote,
  ShoppingBag,
  Briefcase,
  Package,
  Building2,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { Job } from "@/types";

function getAreaConfig(area: string) {
  switch (area.toLowerCase()) {
    case "comércio":
    case "comercio":
      return {
        icon: ShoppingBag,
        badgeClass: "area-commerce",
      };
    case "administrativo":
      return {
        icon: Briefcase,
        badgeClass: "area-admin",
      };
    case "logística":
    case "logistica":
      return {
        icon: Package,
        badgeClass: "area-logistics",
      };
    default:
      return {
        icon: Building2,
        badgeClass: "area-default",
      };
  }
}

export function JobCard({ job }: { job: Job }) {
  const config = getAreaConfig(job.area);
  const AreaIcon = config.icon;
  const company = job.companyName ?? "Empresa Local";
  const isFilled = job.status === "filled";
  const isPaused = job.status === "paused";

  return (
    <Link
      className={`job-card ${config.badgeClass} ${isFilled ? "job-card-filled" : ""}`}
      href={`/empregos/${job.slug}`}
      aria-label={`Ver vaga para ${job.title} em ${job.locationText}`}
    >
      <div className="job-card-top">
        <div className="job-company-row">
          <div className="job-icon-box" aria-hidden="true">
            <AreaIcon size={20} />
          </div>
          <div className="job-company-meta">
            <span className="job-company-name">{company}</span>
            <span className="job-area-tag">{job.area}</span>
          </div>
        </div>

        {isFilled ? (
          <span className="job-badge-pill badge-filled">
            <span className="status-dot-filled" aria-hidden="true" />
            Preenchida
          </span>
        ) : isPaused ? (
          <span className="job-badge-pill badge-paused">
            <span className="status-dot-paused" aria-hidden="true" />
            Pausada
          </span>
        ) : (
          <span className="job-badge-pill badge-active">
            <span className="status-dot-pulse" aria-hidden="true" />
            Inscrições Abertas
          </span>
        )}
      </div>

      <div className="job-card-body">
        <h3 className="job-card-title">{job.title}</h3>

        <div className="job-location-row">
          <MapPin size={14} className="job-pin-icon" aria-hidden="true" />
          <span>{job.locationText}</span>
        </div>

        {job.salary && (
          <div className="job-salary-box">
            <Banknote size={15} aria-hidden="true" />
            <span className="job-salary-value">{job.salary}</span>
          </div>
        )}

        <div className="job-chips">
          <span className="job-chip chip-workmode">{job.workMode}</span>
          <span className="job-chip chip-type">{job.employmentType}</span>
          {job.shift && (
            <span className="job-chip chip-shift">
              <Clock size={11} aria-hidden="true" /> {job.shift}
            </span>
          )}
          <span className="job-chip chip-verified">
            <Sparkles size={11} aria-hidden="true" /> Viamão
          </span>
        </div>

        {job.benefits && job.benefits.length > 0 && (
          <div className="job-benefits-preview">
            <span className="benefits-label">Benefícios:</span>
            <span className="benefits-list">
              {job.benefits.slice(0, 2).join(" • ")}
              {job.benefits.length > 2 ? ` (+${job.benefits.length - 2})` : ""}
            </span>
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <span className="job-action-text">
          {isFilled ? "Ver detalhes (Encerrada)" : "Ver vaga & Candidatar-se"}
        </span>
        <div className="job-action-icon" aria-hidden="true">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </Link>
  );
}
