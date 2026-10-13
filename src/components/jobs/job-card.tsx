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

  return (
    <Link
      className={`job-card ${config.badgeClass}`}
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
        <span className="job-badge-pill">
          <span className="status-dot-pulse" aria-hidden="true" />
          Demonstração
        </span>
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
          <span className="job-chip chip-verified">
            <Sparkles size={11} aria-hidden="true" /> Viamão
          </span>
        </div>
      </div>

      <div className="job-card-footer">
        <span className="job-action-text">Ver detalhes da vaga</span>
        <div className="job-action-icon" aria-hidden="true">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </Link>
  );
}
