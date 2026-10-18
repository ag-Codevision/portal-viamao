-- ==============================================================================
-- MIGRAÇÃO SUPABASE POSTGRESQL — MÓDULO TRABALHE CONOSCO
-- Portal TV Viamão · v1.0
-- Documento de Planejamento de Banco de Dados (Pronto para Execução no Supabase)
-- ==============================================================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TIPOS ENUMERADOS
DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('published', 'paused', 'filled', 'archived', 'pending_review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE employment_type AS ENUM ('CLT', 'PJ', 'MEI', 'Estágio', 'Temporário');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE work_mode AS ENUM ('Presencial', 'Híbrido', 'Remoto');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE job_shift AS ENUM ('Manhã', 'Tarde', 'Noite', 'Integral', 'Escala');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('submitted', 'under_review', 'interview', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE company_status AS ENUM ('pending', 'active', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE company_plan AS ENUM ('assinante', 'anunciante', 'gratuito');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_type AS ENUM ('text', 'choice', 'boolean');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABELA DE EMPRESAS ANUNCIANTES / ASSINANTES
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id VARCHAR(50) NOT NULL DEFAULT 'viamao',
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    website_url TEXT,
    contact_email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    status company_status NOT NULL DEFAULT 'active',
    plan_type company_plan NOT NULL DEFAULT 'anunciante',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Membros/Recrutadores da Empresa (Multi-tenant)
CREATE TABLE IF NOT EXISTS company_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'recruiter', -- 'owner', 'recruiter'
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(company_id, user_id)
);

-- 4. TABELA DE VAGAS DE EMPREGO
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id VARCHAR(50) NOT NULL DEFAULT 'viamao',
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL DEFAULT '{}',
    benefits TEXT[] NOT NULL DEFAULT '{}',
    area VARCHAR(100) NOT NULL,
    employment_type employment_type NOT NULL DEFAULT 'CLT',
    work_mode work_mode NOT NULL DEFAULT 'Presencial',
    shift job_shift NOT NULL DEFAULT 'Integral',
    location_text VARCHAR(255) NOT NULL,
    salary_min NUMERIC(10,2),
    salary_max NUMERIC(10,2),
    salary_currency VARCHAR(10) DEFAULT 'BRL',
    salary_is_public BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    status job_status NOT NULL DEFAULT 'published',
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. PERGUNTAS ESPECÍFICAS DA VAGA
CREATE TABLE IF NOT EXISTS job_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    question_type question_type NOT NULL DEFAULT 'text',
    options TEXT[] DEFAULT '{}',
    is_required BOOLEAN NOT NULL DEFAULT false,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. PERFIS DE CANDIDATOS (OPCIONAL/LGPD)
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL DEFAULT 'Viamão',
    state VARCHAR(10) NOT NULL DEFAULT 'RS',
    linkedin_url TEXT,
    portfolio_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. CANDIDATURAS (APPLICATIONS) COM ISOLAMENTO E PREVENÇÃO DE DUPLICIDADE
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    linkedin_url TEXT,
    portfolio_url TEXT,
    bio TEXT,
    resume_storage_path TEXT,
    resume_file_name VARCHAR(255),
    video_pitch_storage_path TEXT,
    video_pitch_duration_sec INT,
    video_pitch_size_bytes BIGINT,
    status application_status NOT NULL DEFAULT 'submitted',
    recruiter_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- Prevenção rígida contra duplicidade de candidatura:
    CONSTRAINT unique_candidate_per_job UNIQUE (job_id, email)
);

-- 8. RESPOSTAS ÀS PERGUNTAS ESPECÍFICAS
CREATE TABLE IF NOT EXISTS job_application_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES job_questions(id) ON DELETE RESTRICT,
    prompt TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. AUDITORIA E LOGS DE SEGURANÇA
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. ÍNDICES DE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_jobs_status_expires ON jobs(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_city_slug ON jobs(city_id, slug);
CREATE INDEX IF NOT EXISTS idx_jobs_area_mode ON jobs(area, work_mode);
CREATE INDEX IF NOT EXISTS idx_applications_job_status ON job_applications(job_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON job_applications(email);
CREATE INDEX IF NOT EXISTS idx_company_members_user ON company_members(user_id);

-- 11. POLÍTICAS DE ROW LEVEL SECURITY (RLS)

-- Habilitar RLS em todas as tabelas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_application_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Regras para 'jobs'
-- Público pode ver apenas vagas publicadas e não expiradas
CREATE POLICY "Public read active jobs" ON jobs
    FOR SELECT
    USING (status = 'published' AND expires_at > timezone('utc'::text, now()));

-- Empresas podem ver, criar e editar apenas suas próprias vagas
CREATE POLICY "Companies can manage own jobs" ON jobs
    FOR ALL
    USING (
        company_id IN (
            SELECT company_id FROM company_members WHERE user_id = auth.uid()
        )
    );

-- Regras para 'job_applications'
-- Candidato pode criar sua candidatura se a vaga for 'published' e não preenchida
CREATE POLICY "Anyone can submit application to active job" ON job_applications
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = job_id 
              AND jobs.status = 'published' 
              AND jobs.expires_at > timezone('utc'::text, now())
        )
    );

-- Candidato pode ver suas próprias candidaturas pelo e-mail autenticado
CREATE POLICY "Candidates can view own applications" ON job_applications
    FOR SELECT
    USING (
        email = auth.jwt() ->> 'email'
        OR candidate_id IN (
            SELECT id FROM candidate_profiles WHERE user_id = auth.uid()
        )
    );

-- Empresas só podem ver candidaturas das suas próprias vagas (Tenant Isolation)
CREATE POLICY "Companies can view applications for their jobs" ON job_applications
    FOR SELECT
    USING (
        job_id IN (
            SELECT j.id FROM jobs j
            JOIN company_members cm ON cm.company_id = j.company_id
            WHERE cm.user_id = auth.uid()
        )
    );

-- Empresas podem atualizar status e anotações apenas das suas vagas
CREATE POLICY "Companies can update applications for their jobs" ON job_applications
    FOR UPDATE
    USING (
        job_id IN (
            SELECT j.id FROM jobs j
            JOIN company_members cm ON cm.company_id = j.company_id
            WHERE cm.user_id = auth.uid()
        )
    );

-- 12. STORAGE BUCKETS PRIVADOS PARA RESUMES E VÍDEOS DE APRESENTAÇÃO
-- Observação: Para execução no Supabase Storage:
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES 
--   ('resumes', 'resumes', false, 5242880, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
--   ('presentation-videos', 'presentation-videos', false, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']);
