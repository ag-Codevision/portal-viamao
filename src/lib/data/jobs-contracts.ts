import type {
  Job,
  JobFilters,
  Company,
  JobApplication,
  JobApplicationStatus,
  JobStatus,
} from "@/types";
import type { CompanyJobFormData, ApplicationSubmissionFormData } from "@/lib/validation/job-module";

export interface JobsModuleRepository {
  // Público
  listPublicJobs(filters?: JobFilters): Promise<Job[]>;
  getJobBySlug(slug: string): Promise<Job | null>;
  getJobById(id: string): Promise<Job | null>;
  submitApplication(
    data: ApplicationSubmissionFormData
  ): Promise<{ success: boolean; applicationId?: string; error?: string }>;

  // Candidato
  listCandidateApplications(candidateEmail: string): Promise<JobApplication[]>;

  // Empresas (Tenant Isolation)
  getCompany(companyId: string): Promise<Company | null>;
  listCompanies(): Promise<Company[]>;
  listCompanyJobs(companyId: string): Promise<Job[]>;
  createJob(companyId: string, data: CompanyJobFormData): Promise<Job>;
  updateJob(companyId: string, jobId: string, data: Partial<CompanyJobFormData>): Promise<Job | null>;
  setJobStatus(companyId: string, jobId: string, status: JobStatus): Promise<Job | null>;
  listJobApplications(companyId: string, jobId: string): Promise<JobApplication[]>;
  updateApplicationStatus(
    companyId: string,
    applicationId: string,
    status: JobApplicationStatus,
    notes?: string
  ): Promise<JobApplication | null>;

  // Moderação Administrativa
  listAllJobsForAdmin(): Promise<Job[]>;
  moderateJob(jobId: string, action: "approve" | "reject" | "pause"): Promise<boolean>;
}
