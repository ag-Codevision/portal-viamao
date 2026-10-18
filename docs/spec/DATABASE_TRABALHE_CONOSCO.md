# Planejamento do Banco de Dados — Módulo Trabalhe Conosco
**Portal TV Viamão · v1.0**  
**Data:** 18 de outubro de 2026  
**Status:** Especificação Técnica e Planejamento de Persistência (Supabase PostgreSQL)  

---

## 1. Visão Geral da Modelagem

O modelo de dados foi concebido para o **Supabase PostgreSQL**, priorizando:
1. **Isolamento Multi-Tenant Estrito**: Cada empresa anunciante ou assinante acessa exclusivamente suas próprias vagas e os candidatos que se inscreveram nelas.
2. **Prevenção de Duplicidade de Candidaturas**: Uma constraint única `UNIQUE(job_id, email)` impede candidaturas repetidas do mesmo candidato para a mesma oportunidade.
3. **Segurança de Acesso e LGPD**: Políticas de *Row Level Security* (RLS) habilitadas em 100% das tabelas.
4. **Proteção de Mídia Sensível**: Buckets de armazenamento privados no Supabase Storage para currículos (PDF/DOC) e vídeos de apresentação (WebM/MP4 até 100 MB), acessíveis apenas via links assinados de curta duração gerados no servidor.

---

## 2. Diagrama Entidade-Relacionamento (ERD)

```mermaid
erDiagram
    COMPANIES ||--o{ COMPANY_MEMBERS : "possui membros"
    COMPANIES ||--o{ JOBS : "publica"
    JOBS ||--o{ JOB_QUESTIONS : "contém perguntas"
    JOBS ||--o{ JOB_APPLICATIONS : "recebe inscrições"
    CANDIDATE_PROFILES ||--o{ JOB_APPLICATIONS : "pode vincular"
    JOB_APPLICATIONS ||--o{ JOB_APPLICATION_ANSWERS : "possui respostas"
    AUTH_USERS ||--o{ COMPANY_MEMBERS : "associa usuário"
    AUTH_USERS ||--o{ CANDIDATE_PROFILES : "login opcional"

    COMPANIES {
        uuid id PK
        string city_id
        string name
        string slug UK
        string logo_url
        string contact_email
        company_status status
        company_plan plan_type
    }

    JOBS {
        uuid id PK
        uuid company_id FK
        string slug UK
        string title
        text description
        string_array requirements
        string_array benefits
        string area
        employment_type employment_type
        work_mode work_mode
        job_shift shift
        string location_text
        numeric salary_min
        numeric salary_max
        boolean salary_is_public
        job_status status
        timestamp expires_at
    }

    JOB_QUESTIONS {
        uuid id PK
        uuid job_id FK
        text prompt
        question_type question_type
        string_array options
        boolean is_required
        int sort_order
    }

    JOB_APPLICATIONS {
        uuid id PK
        uuid job_id FK
        uuid candidate_id FK
        string full_name
        string email
        string phone
        string resume_storage_path
        string video_pitch_storage_path
        int video_pitch_duration_sec
        bigint video_pitch_size_bytes
        application_status status
        text recruiter_notes
        timestamp created_at
    }

    JOB_APPLICATION_ANSWERS {
        uuid id PK
        uuid application_id FK
        uuid question_id FK
        text prompt
        text answer
    }
```

---

## 3. Dicionário de Dados e Estados

### 3.1 Tipos Enumerados (ENUMs)
- `job_status`: `'published'` (ativa/aberta), `'paused'` (pausada temporariamente), `'filled'` (preenchida — bloqueia novas candidaturas), `'archived'` (arquivada), `'pending_review'` (aguardando moderação).
- `employment_type`: `'CLT'`, `'PJ'`, `'MEI'`, `'Estágio'`, `'Temporário'`.
- `work_mode`: `'Presencial'`, `'Híbrido'`, `'Remoto'`.
- `job_shift`: `'Manhã'`, `'Tarde'`, `'Noite'`, `'Integral'`, `'Escala'`.
- `application_status`: `'submitted'` (enviada), `'under_review'` (em análise), `'interview'` (entrevista), `'approved'` (aprovada), `'rejected'` (não selecionada).
- `company_status`: `'pending'`, `'active'`, `'suspended'`.
- `company_plan`: `'assinante'`, `'anunciante'`, `'gratuito'`.
- `question_type`: `'text'`, `'choice'`, `'boolean'`.

---

## 4. Estratégia de Storage (Privacidade e Arquivos)

| Recurso | Bucket Supabase | Visibilidade | Limite de Tamanho | Formatos Permitidos | Política de Acesso |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Currículos** | `resumes` | Privado | 5 MB | `.pdf`, `.doc`, `.docx` | Apenas recrutadores da empresa contratante e o candidato titular. |
| **Vídeo Pitch** | `presentation-videos` | Privado | 100 MB | `.mp4`, `.webm`, `.mov` | URLs assinadas (`createSignedUrl`) com expiração de 60 minutos para a empresa. |
| **Logos das Empresas** | `company-assets` | Público | 2 MB | `.webp`, `.png`, `.jpg`, `.svg` | Leitura pública para exibição nos cards e cabeçalhos. |

---

## 5. Regras de Transição (Frontend-First com Mocks)

Conforme instrução do usuário:
1. **Fase Atual**: Todo o frontend, as páginas e as interações do usuário rodam via **repositório reativo com dados mockados em memória** (`JobsMockStore`), sem conexões de rede externas nem banco ativo.
2. **Fase Futura de Ativação do Banco**: Para ativar o Supabase PostgreSQL em produção, bastará aplicar o arquivo `supabase/migrations/20261018000000_trabalhe_conosco.sql` e alternar o adapter no `src/lib/data/index.ts`.
