# PORTAL DE TV E SERVIÇOS LOCAIS — SPEC V1.1
**Projeto:** Portal digital de Viamão — RS  
**Status:** especificação de produto e engenharia para o MVP  
**Data:** 12 de outubro de 2026  
**Nome comercial:** a definir  
**Documentos associados:** `DESIGN.md`  

## 1. Resumo executivo
Plataforma web local com TV linear ao vivo, programação editorial contínua, catálogo de vídeos sob demanda (VOD) inspirado na facilidade de descoberta dos serviços de streaming e serviços comunitários em seção independente, começando por empregos. O piloto atende Viamão, Rio Grande do Sul. A arquitetura aceita a expansão para outras cidades sem duplicar a aplicação.

**Missão do MVP:** validar audiência, utilidade comunitária e capacidade editorial antes de qualquer monetização. Publicações e divulgação de vagas serão gratuitas durante o piloto. A meta é infraestrutura de custo zero dentro das franquias gratuitas e dos respectivos termos; isso não é garantia de operação 24/7 gratuita nem de custo zero em qualquer escala.

## 2. Decisões consolidadas
- **Território:** Viamão/RS, Brasil, como primeira e única cidade visível no MVP; estrutura multicidade desde o banco.
- **Modelo:** web responsiva; TV ao vivo real sincronizada e VOD navegável; módulo Empregos em rota e UI independentes.
- **Lançamento:** conteúdo e vagas gratuitos; sem checkout, assinaturas, banners pagos ou faturamento no MVP.
- **Sequência:** frontend navegável com mocks e contratos tipados; depois Supabase, autenticação, CMS e vídeo real.
- **Stack:** Next.js App Router + React + TypeScript + Tailwind CSS + shadcn/ui + Motion/GSAP pontual; Supabase PostgreSQL/Auth/Storage; deploy preferencial Vercel condicionado à adequação do plano.
- **Não usar SQLite:** Supabase PostgreSQL é o banco único de produção; migrações versionadas e tipos gerados.
- **Vídeo:** YouTube como origem inicial para vídeos próprios/embeds permitidos; distribuição 24/7 dependerá de operação e origem de sinal apropriadas, nunca da Vercel como encoder persistente.
- **Direitos:** conteúdo público ou embed disponível não implica autorização para reemitir em grade própria.

## 3. Metas, indicadores e não metas
**Metas:** publicar uma TV de uso simples; dar acesso a jornalismo e documentários locais; publicar e moderar vagas; medir uso com respeito à privacidade; possibilitar expansão regional.

**KPIs de piloto:** visitantes únicos; cliques em Assistir ao vivo; tempo de reprodução (quando mensurável); espectadores simultâneos (quando fornecido pelo provedor); plays VOD; buscas; visitas/candidaturas externas a vagas; disponibilidade de stream; erros do player; tempo de moderação.

**Fora do MVP:** apps iOS/Android, TV conectada, perfil de assinante, paywall, streaming próprio com transcodificação, DVR/catch-up, candidaturas com upload de currículo, recomendações por IA, marketplace, sistema de cobrança, integração de múltiplos canais ao vivo e troca automática de origens arbitrárias.

## 4. Personas e perfis de acesso
- **Visitante:** vê ao vivo, busca programas, consulta vagas, usa acessibilidade e compartilhamento.
- **Empresa:** envia vaga através de formulário público sujeito a revisão; sem conta corporativa obrigatória no MVP.
- **Editor:** cria/edita conteúdos, programas e notícias e prepara publicações.
- **Moderador:** revisa vagas, denúncias e conteúdo submetido.
- **Administrador:** gerencia equipe, cidades, homepage, grade de exibição, direitos e configurações.

## 5. Navegação e rotas
- `/` — Home, hero editorial, live em destaque, trilhos VOD, notícias e chamada discreta para empregos.
- `/ao-vivo` — player, indicador AO VIVO, programa atual/próximo, guia do dia e falhas explícitas.
- `/programas` — catálogo com busca, categorias e filtros; `/programas/[slug]` — detalhes e episódios.
- `/assistir/[slug]` — player VOD e vídeos relacionados (ou modal de reprodução acessível, se decidido no design).
- `/documentarios` — coleção filtrada, opcionalmente tratada como categoria do catálogo.
- `/noticias` e `/noticias/[slug]` — editoriais locais (feed mínimo no MVP se houver equipe editorial).
- `/empregos` e `/empregos/[slug]` — busca, filtros, vaga e candidatura externa.
- `/empregos/publicar` — envio de vaga com antispam e validação.
- `/sobre`, `/contato`, `/privacidade`, `/termos`, `/acessibilidade` — conteúdo institucional e políticas.
- `/admin/*` — área restrita; login e autorização no servidor.
- **Preparação futura:** `city_id` em entidades e URLs regionalizadas quando multicidade for ativado; evitar links públicos quebrados na migração.

## 6. Requisitos funcionais — experiência TV
**RF-TV-01** Player ao vivo mostra sinal real e contínuo, sem reiniciar por entrada de espectador. Na fase de frontend, placeholder rotulado como demonstração — nunca fingir stream sincronizado.

**RF-TV-02** Exibir status AO VIVO, título, categoria, horário de início/término e próximo programa usando fuso `America/Sao_Paulo`. Sincronizar grade por dados de backend e tempo de servidor, com margem para atraso do sinal.

**RF-TV-03** Oferecer controles disponibilizados pelo player de origem; reconhecer que iframe YouTube impõe limites para customização, telemetria e picture-in-picture.

**RF-TV-04** Caso o sinal esteja indisponível, mostrar aviso e ação de tentar novamente; nunca trocar silenciosamente por conteúdo não licenciado.

**RF-TV-05** Guia de programação (EPG) por data com estados agora, próximo e encerrado. Grade é representação editorial; operação 24/7 exige playout externo e supervisão humana.

**RF-TV-06** Mini-player persistente é melhoria progressiva; implementação com embed dependerá de comportamento suportado pelo provedor e política de autoplay. Sem áudio automático.

## 7. Requisitos funcionais — catálogo/VOD
**RF-VOD-01** Trilhos horizontais por categoria, cards 16:9 e destaques editoriais.

**RF-VOD-02** Detalhe de programa com sinopse, capa, metadados, temporada, episódios, ordem editorial e status.

**RF-VOD-03** Busca textual e filtros básicos; URLs estáveis e páginas indexáveis para conteúdos públicos.

**RF-VOD-04** Reprodução incorporada apenas de fontes com permissão; indicar vídeo indisponível e opção de voltar ao catálogo.

**RF-VOD-05** Continuar assistindo/favoritos somente após definir consentimento e mecanismo de persistência; dispensáveis no MVP inicial.

## 8. Requisitos funcionais — empregos
**RF-JOB-01** Página independente, utilitária e responsiva, com pesquisa por palavra-chave, área, modalidade e data.

**RF-JOB-02** Vaga com título, empresa, bairro/cidade, modelo de trabalho, descrição, requisitos, tipo de vínculo, remuneração opcional, prazo e método de candidatura.

**RF-JOB-03** Formulário público de envio com validação, rate limit/CAPTCHA quando necessário, confirmação e publicação somente após aprovação.

**RF-JOB-04** Candidatura externa (link ou e-mail disponibilizado pelo anunciante), sem cadastro de candidatos nem armazenamento de currículos.

**RF-JOB-05** Vagas vencidas saem das listagens; denúncias e revisão administrativa permanecem possíveis.

## 9. CMS e governança
Módulos mínimos: Dashboard; Programas/Episódios; Categorias; Grade; Notícias (se ativadas); Empresas/Vagas; Mídia/Capas; Direitos e Licenças; Usuários/Papéis; Configurações de Viamão.

Fluxo editorial: `rascunho → revisão → publicado → arquivado`; vaga: `recebida → em análise → aprovada/publicada | rejeitada → expirada`. Registro de autor, alterações e timestamp.

Restrições: permissões verificadas no servidor, RLS do Supabase, credenciais administrativas somente no servidor, uploads limitados, políticas de armazenamento, backups/exportações e trilha de auditoria proporcional ao risco.

## 10. Modelo de dados inicial (PostgreSQL)
- `cities(id, slug, name, state_code, timezone, is_active)`; seed `viamao`, `RS`, `America/Sao_Paulo`.
- `profiles(id, display_name, role, city_id, created_at)` ligado a `auth.users`; papéis aplicados também no servidor.
- `programs(id, city_id, slug, title, synopsis, category_id, cover_path, status, published_at)`.
- `episodes(id, program_id, slug, title, synopsis, duration_seconds, video_provider, video_external_id, status, rights_id, published_at)`.
- `categories(id, slug, name, sort_order)` e relacionamento com programas.
- `broadcast_slots(id, city_id, starts_at, ends_at, program_id, episode_id, label, status)` com timestamps UTC, interface no fuso local.
- `live_channels(id, city_id, provider, embed_url, public_status, is_primary)`; credenciais de operação nunca em campos públicos.
- `rights_licenses(id, holder, proof_url_private, usage_scope, permitted_platforms, valid_from, valid_until, redistribution_allowed)`.
- `companies(id, city_id, name, slug, contact_email_private, website_url, status)`.
- `jobs(id, city_id, company_id, slug, title, description, employment_type, work_mode, location_text, application_url, application_email, expires_at, status)`.
- `articles(id, city_id, slug, title, body, cover_path, status, published_at)` (habilitar apenas se notícias entrarem no primeiro corte).
- `audit_events(id, actor_id, entity_type, entity_id, action, occurred_at)`.

Índices em slugs, status, `city_id`, `published_at`, `starts_at` e `expires_at`; unicidade contextual de slugs; chaves estrangeiras, restrições de status e RLS por entidade. Não salvar vídeos grandes no Supabase Storage gratuito.

## 11. Contratos de dados e abordagem frontend-first
Implementar primeiro mocks versionados e funções em `src/lib/data/` com assinatura estável. Exemplos: `getHomeFeed(citySlug)`, `getLiveNow(citySlug)`, `getSchedule(date,citySlug)`, `listPrograms(filters)`, `getProgram(slug)`, `listJobs(filters)`, `getJob(slug)`.

Criar tipos para `Program`, `Episode`, `ScheduleSlot`, `LiveChannel`, `Job`, `Company`, `City`, `Article` e estados `loading`, `empty`, `error`, `ready`. Quando o Supabase entrar, substituir adapters sem reescrever as páginas. Chamadas sensíveis no servidor; nunca expor chaves service-role no navegador.

## 12. Arquitetura, infraestrutura e limite de custo
**Frontend e APIs:** Next.js App Router com renderização híbrida; Vercel para protótipo não comercial enquanto permitido pelo plano Hobby. Antes de publicar oficialmente, verificar elegibilidade do plano para a operação real, inclusive atividade promocional; se não for elegível, migrar hospedagem ou contratar plano adequado. Não prometer Vercel Hobby gratuita para uso comercial.

**Banco e autenticação:** Supabase Free com PostgreSQL/Auth/Storage; sujeito a cotas e eventual pausa por inatividade. Separar ambientes quando necessário e manter migrações/exportação documentadas.

**Vídeo:** arquivos autorais e lives publicados no YouTube conforme regras e disponibilidade; incorporar pelo player oficial e API onde autorizada. O YouTube não fornece automaticamente programação linear própria contínua; playout contínuo requer infraestrutura/operador separado, e pode gerar custo de energia, internet e operação. Na validação inicial, operar lives em horários anunciados se 24/7 ainda não for sustentável, sem comunicar falsamente disponibilidade integral.

**Domínio:** subdomínio `.vercel.app` no protótipo; domínio próprio é custo opcional futuro. **E-mail:** sem integração paga obrigatória; fluxos críticos devem prever limites de e-mail transacional do provedor.

## 13. Segurança, LGPD e direitos
- Coletar somente dados necessários; políticas de privacidade e retenção; base legal por finalidade; contato para solicitações de titulares.
- Supabase Auth para equipe; RLS em tabelas expostas, revisão de roles e validação server-side de cada mutação.
- Rate limiting, honeypot/CAPTCHA em envios, proteção de credenciais, validação de links e prevenção de XSS.
- Vagas: prevenir golpes; informar ao usuário que a candidatura ocorre em site/e-mail externo; sem upload de currículos no MVP.
- Direitos de transmissão: registrar fonte, titular, autorização, prazo, território, distribuição e monetização; canal 'aberto' ou vídeo público não significa 'sem copyright'.
- Publicações jornalísticas: política editorial, canal de correção e diferenciação de conteúdo patrocinado futuro.

## 14. Plano de construção e entregáveis
**Etapa A — Design system e frontend:** `DESIGN.md`; shell de navegação; home; ao vivo demonstrativo; catálogo; programas; vagas; estados responsivos; mocks e testes UI.

**Etapa B — Dados e CMS:** esquema/migrações PostgreSQL; Supabase Auth; RLS; CRUD editorial; formulário moderado de vagas; upload de imagens; testes de autorização.

**Etapa C — Vídeo real:** conectar players VOD e canal efetivamente ao vivo; grade sincronizada; tratamento de falhas; direitos; monitoramento e rotina operacional.

**Etapa D — Piloto público:** conteúdo inicial e vagas reais; revisão LGPD/licenças; SEO local; desempenho mobile; acessibilidade; métricas essenciais; validação de infraestrutura e termos de hospedagem.

**Etapa E — Pós-MVP:** multicidade visível, monetização, perfis empresariais, recomendação, recursos de comunidade e eventual stack de streaming dedicada.

## 15. Critérios de aceite (Definition of Done)
- Todas as rotas públicas essenciais funcionam em desktop e celular; menus, busca e formulários têm loading/empty/error.
- `Ao vivo` diferencia claramente demonstração de sinal real e, quando em produção, não reinicia para cada novo visitante.
- Grade exibe hoje/agora/próximo em `America/Sao_Paulo` e não promete precisão impossível quando há latência da live.
- Um conteúdo publicado no CMS aparece corretamente no catálogo e tem estado de disponibilidade de vídeo.
- Vaga enviada passa por revisão, não aparece antes da aprovação e desaparece após expirar.
- Permissões, RLS e dados privados validados em teste; nenhum segredo de servidor vai para o frontend.
- Acessibilidade básica WCAG 2.2 AA como meta: teclado, foco visível, contraste, labels, legenda quando disponível, redução de movimento.
- Testes: lint, typecheck, build, smoke E2E rotas críticas, acessibilidade automatizada e revisão manual; performance auditada em mobile.
- Não há dependência obrigatória de recurso pago durante o protótipo; lançamento depende de conferência atual de preços, cotas, licenças e termos.

## 16. Riscos e decisões pendentes
**R1:** marca e identidade final ainda indefinidas — trabalhar com nome provisório visual `VIAMÃO • PORTAL` substituível por config.

**R2:** equipe, rotina editorial e catálogo inicial não definidos — planejar telas vazias elegantes e seed de demonstração marcado.

**R3:** sinal linear 24/7 não resolvido — decidir operador, disponibilidade e fallback antes de prometer grade contínua no lançamento.

**R4:** TV de terceiros — exigir documentação de licença específica para redistribuição; embeds oficiais podem ser mostrados como itens independentes, não necessariamente incorporados ao sinal linear.

**R5:** Vercel Hobby — validar termos de hospedagem ao passar de protótipo a portal público operacional.

**R6:** políticas de publicação de vagas, moderação, marca, métricas e domínio ainda serão ratificadas.

## 17. Controle de versão
**V1.0 → V1.1:** cidade-piloto definida como Viamão/RS; priorização expressa de custo zero; lançamento sem cobrança; stack Next.js/Vercel/Supabase PostgreSQL sem SQLite; estratégia frontend-first; arquitetura de dados e CMS detalhadas; separação entre mock e live real; ressalvas de direitos/infraestrutura 24/7; checklist de aceite; `DESIGN.md` associado.
