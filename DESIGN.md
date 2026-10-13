# DESIGN.md — PORTAL VIAMÃO
> **Design system de produção · v1.1 · 12/10/2026**  
> Projeto: TV local ao vivo + streaming sob demanda + serviços comunitários (Empregos).  
> Nome e logo são provisórios. Não reproduzir marca, artwork ou interface proprietária da Netflix; usar apenas princípios amplos de descoberta por catálogo.

## 1. North Star
Criar uma experiência editorial local com sensação de streaming internacional: cinematográfica, premium, acessível e útil. A TV ao vivo é o destino emocional; o conteúdo sob demanda dá profundidade; Empregos é um serviço cotidiano em aba separada. Valor percebido alto **sem** efeitos que comprometam desempenho ou legibilidade.

**Palavras-chave:** LOCAL · CONFIÁVEL · CONTEMPORÂNEO · CINEMATOGRÁFICO · ÚTIL.  
**Princípios:** conteúdo primeiro; navegação previsível; hierarquia editorial; poucas ações por tela; performance móvel; transparência sobre stream, conteúdo patrocinado e disponibilidade.

## 2. Arquitetura da informação
**Navegação global:** Logo provisória | Início | Ao Vivo | Programas | Documentários | Notícias | Empregos | Busca.  
**Desktop:** header fixo discreto com transparência sobre hero e fundo sólido ao rolar; opção de CTA `ASSISTIR AO VIVO`.  
**Mobile:** header compacto; menu acessível com drawer; CTA Ao Vivo visível; evitar mais de cinco links simultâneos.

**Hierarquia da Home:** Hero de programa em destaque → módulo Ao Vivo Agora → trilhos editoriais (Novidades, Jornalismo, Documentários, Histórias de Viamão) → chamada contextual Empregos → rodapé institucional.

**Ao Vivo:** player amplo 16:9 + bloco de informações + agora/próximo + EPG horizontal ou lista responsiva.  
**Catálogo:** filtros/busca e prateleiras; detalhe editorial com sinopse/episódios.  
**Empregos:** interface mais clara e funcional que o catálogo, porém conectada à identidade, com busca na primeira dobra, filtros e cards escaneáveis.

## 3. Tokens de design
Valores iniciais, calibrar no navegador com testes de contraste; centralizar em CSS variables e Tailwind theme.

```css
:root {
  --bg: #090B0F;
  --surface: #121720;
  --surface-elevated: #1B2330;
  --surface-soft: #232D3A;
  --text: #F5F7FA;
  --text-muted: #A7B0BE;
  --line: rgba(255,255,255,.12);
  --brand: #D7A85D;
  --brand-hover: #E6BA78;
  --live: #E14545;
  --success: #46BE8B;
  --focus: #91C9FF;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 22px;
  --container: 1440px;
  --gutter: clamp(20px, 4vw, 72px);
}
```

**Cor:** preto grafite e azul-grafite para imersão; dourado fosco para assinatura editorial; vermelho reservado exclusivamente ao sinal `AO VIVO` e incidentes. Evitar neon. Gradientes leves somente para legibilidade de textos sobre imagens.

**Tipografia:** `Inter` ou `Manrope` (self-host opcional; fallback system). Títulos com peso 600–750 e tracking negativo discreto; metadados com caixa alta e letter-spacing. Não sacrificar acentos e legibilidade do português brasileiro.

**Escala:** display `clamp(2.5rem, 5vw, 5.5rem)`; H1 `clamp(2rem, 3.6vw, 4rem)`; H2 `clamp(1.5rem, 2.5vw, 2.75rem)`; corpo 16–18px; metadados 12–14px. Line height de texto 1.45–1.7; evitar corpo com menos de 14px.

**Espaçamento:** base 4px; sequência 4/8/12/16/24/32/48/64/96; gap de cards `clamp(12px,1.6vw,24px)`.  
**Grid:** desktop até 12 colunas, conteúdo 1440px; tablet 8; mobile 4, com calhas de 20px; cards responsivos e trilhos que permitam rolagem horizontal com snap.

## 4. Composição da Home
### 4.1 Hero cinematográfica
- Altura desktop ~`min(78svh, 820px)`; mobile 60–70svh, sem ocultar navegação.
- Imagem autoral/editorial em proporção 16:9 (AVIF/WebP), com foco visual longe do título e gradiente de apoio.
- Eyebrow `DESTAQUE DA SEMANA`; título em no máximo 2–3 linhas; sinopse curta; CTAs `ASSISTIR AGORA` e `VER DETALHES`.
- Uma única hero prioritária (não iniciar com carrossel automático); preferir imagem estática e micro-motion a vídeo autoplay custoso.
- Sem texto embutido no bitmap, para suportar responsividade e acessibilidade.

### 4.2 Módulo Ao Vivo
- Badge vermelho `AO VIVO` somente se houver sinal efetivamente ativo; em mock usar `PRÉVIA DO PLAYER`.
- Thumbnail 16:9 e progresso editorial do programa; `AGORA` / `A SEGUIR` com horários locais.
- CTA visível `ASSISTIR À TV` levando a `/ao-vivo`; informar quando fora do ar.

### 4.3 Trilhos VOD
- Cards 16:9 de bordas levemente arredondadas; título e categoria fora da imagem para leitura.
- Desktop 4–5 cards visíveis; tablet 2–3; mobile 1.3–1.7 (indica continuidade).
- Com teclado, setas e foco devem permitir acessar todo conteúdo. Nada depende exclusivamente de hover.
- Hover: elevação e escala `1.02`, overlay com Play; evitar saltos de layout e carrosséis frenéticos.

### 4.4 Empregos na Home
- Apenas um módulo breve `Oportunidades em Viamão` com 3 vagas recentes e link `VER TODAS AS VAGAS`.
- Não misturar cards de vagas com cards de vídeo; marcação semântica visual distinta.

## 5. Telas internas — gramática de componentes
**Ao Vivo:** player dominante 16:9; controles nativos/compatíveis do provedor; EPG e estado de indisponibilidade abaixo; não colocar navegação por cima do vídeo.  
**Programas:** filtros por categoria; card com thumbnail 16:9, nome e duração; conteúdo editorial organizado em episódios.  
**Detalhe:** capa larga, título, sinopse, informações, lista de episódios, conteúdos relacionados.  
**Notícias:** leitura confortável, `max-width: 70ch`, título grande, metadados e imagens com créditos.  
**Empregos:** hero utilitária, campo de busca, filtros, contador, lista/card compacto, metadados com chips; vaga detalhada com CTA `CANDIDATAR-SE` marcado como externo.  
**Admin:** layout funcional e discreto, navegação lateral, tabelas sem efeitos decorativos, status visíveis, confirmação de ações destrutivas.

## 6. Biblioteca de componentes (React)
- `SiteHeader`, `MobileNav`, `SiteFooter`, `CityLabel`, `SearchTrigger`.
- `EditorialHero`, `LiveStatusBadge`, `LivePlayer`, `NowNext`, `ScheduleGuide`, `ScheduleSlot`.
- `MediaCard`, `MediaRail`, `MediaSkeleton`, `ProgramHero`, `EpisodeList`, `EmptyState`.
- `JobSearchBar`, `JobFilters`, `JobCard`, `JobDetail`, `JobSubmitForm`, `ExternalLinkNotice`.
- `SectionHeading`, `Button`, `Badge`, `Modal`, `Sheet`, `Toast`, `ErrorState`, `LoadingState`.
- `AdminShell`, `DataTable`, `StatusPill`, `MediaUploader`, `EditorialForm`.

**Estados obrigatórios:** default, hover, focus-visible, active, disabled, loading, empty, error, success; testar teclado/touch em todos os interativos.

## 7. Motion system
**Objetivo:** guiar atenção, jamais simular um produto mais funcional do que é.  
**Duração:** microinterações 120–200ms; entradas 350–650ms; easing `cubic-bezier(.22,1,.36,1)`.  
**Padrões:** fade + translateY 12–24px nas seções, stagger discreto de cards e transições de capa com pouca profundidade.

**Tecnologia:** CSS transitions como padrão; Motion para transições de componentes; GSAP apenas para momentos editoriais pontuais e com lazy-load. Evitar efeito parallax agressivo, smooth-scroll obrigatório, webgl, vídeos em background no mobile e custom cursor intrusivo.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 8. Comportamento de vídeo
- Não reproduzir com áudio sem gesto do usuário; YouTube embed requer respeitar políticas e capacidades do iframe.
- Player 16:9 adaptável; fullscreen disponível onde suportado; preservar proporção sem crop de imagem em conteúdo do vídeo.
- Placeholder de demonstração sempre identificado; badge AO VIVO somente ligado a estado real informado pelo provedor/operação.
- Erro de embed, vídeo removido ou restrito deve gerar estado compreensível com links alternativos permitidos.
- Mini-player persistente opcional e desativado se tecnologia de embed, mobile ou acessibilidade não permitir comportamento robusto.

## 9. Acessibilidade e linguagem
- `lang="pt-BR"`, títulos hierárquicos, `main`, landmark de navegação, skip link `Pular para conteúdo`.
- Contraste mínimo WCAG AA; focus ring azul visível; alvos de toque preferencialmente >=44px; textos alternativos para imagens significativas.
- Navegação por teclado em trilhos, menu e filtros; alertas e erros anunciados; `aria-live` seletivo para alteração de grade sem interromper reprodução.
- Respeitar reduced-motion e reduced-data; fornecer legendas/transcrição quando possível; controles de mídia com nomes claros.
- Tom editorial próximo, confiável e regional, mas sem caricatura; português brasileiro, horários `HH:mm`, datas `dd/MM/yyyy`.

## 10. Responsividade e performance
**Breakpoints indicativos:** mobile <640px; tablet 640–1023px; desktop >=1024px; grandes telas >=1440px. Ajustar pelo conteúdo.  
**Imagens:** `next/image`, formatos modernos, prioridade apenas hero, srcset otimizado, lazy load nos trilhos; não carregar centenas de posters simultaneamente.

**Fontes:** `next/font`, subconjuntos necessários, display swap.  
**JS:** SSR/RSC para catálogo, importar players e animações pesadas sob demanda; cache/revalidate conforme atualização editorial.  
**Metas:** LCP <2.5s, CLS <0.1 e INP <200ms no percentil 75 quando tecnicamente viável; auditar mobile real e rede lenta. Não tratar Lighthouse de desktop como garantia.

## 11. SEO e conteúdo local
- Metadata por página, Open Graph, sitemap, robots, URL canônica, títulos legíveis.
- Structured data quando apropriado (`VideoObject`, `BroadcastEvent` somente se de fato aplicável, `JobPosting` para vagas válidas, `NewsArticle` quando houver jornalismo).
- Referências geográficas a Viamão somente quando relevantes; nada de páginas duplicadas para cidades ainda não atendidas.
- Slugs estáveis, redirects nas mudanças, status de publicação coerente com indexação.

## 12. Arquitetura de frontend
```text
src/
  app/
    (portal)/page.tsx
    (portal)/ao-vivo/page.tsx
    (portal)/programas/page.tsx
    (portal)/programas/[slug]/page.tsx
    (portal)/assistir/[slug]/page.tsx
    (portal)/empregos/page.tsx
    (portal)/empregos/[slug]/page.tsx
    (portal)/empregos/publicar/page.tsx
    (portal)/noticias/page.tsx
    (portal)/sobre/page.tsx
    admin/
  components/{layout,media,live,jobs,ui}/
  features/{catalog,live,jobs,news}/
  lib/{data,validation,supabase,utils}/
  mocks/
  styles/
  types/
```

**Contratos:** componentes recebem props tipadas; `data` expõe serviços substituíveis (mocks → Supabase); `zod` ou equivalente valida entrada de formulários; renderização de conteúdo não deve depender da existência de login.

**Ambientes:** `.env.example` sem valores reais; chave pública (anon/publishable) pode ir ao cliente quando RLS está correta, mas `service_role` nunca. CI: lint, typecheck, tests, build.

## 13. Conteúdo e direção de imagem
- Fotografias autorais de Viamão, pessoas reais com autorização, bastidores de gravação, documentários, negócios e histórias locais.
- Tratamento de cor editorial consistente: sombras profundas, tons de pele naturais, saturação controlada e contraste cinematográfico sem artificialidade.
- Capas e thumbnails padronizadas 16:9; hero desktop ideal >=1920×1080 antes da otimização; prever crop mobile.
- Não usar imagens de terceiros sem licença nem logos/plataformas conhecidas como identidade do portal.

## 14. Critérios de revisão de design
- Hero comunica em menos de 5 segundos que o portal é uma TV local de Viamão.
- A ação `Assistir ao vivo` é encontrada facilmente em home e header.
- Uma pessoa distingue claramente conteúdo ao vivo, vídeo sob demanda, notícia e vaga.
- Estado do stream é verdadeiro; nenhuma tela simula transmissão real sem aviso.
- Todos os cards e formulários funcionam por toque e teclado; foco e feedback são evidentes.
- A versão mobile mantém boa legibilidade, sem overflow horizontal indesejado nem layout jumping.
- A estética é autoral, não uma réplica visual exata de qualquer serviço conhecido.

## 15. Backlog de design pós-MVP
Perfil de cidade; canais e programação por cidade; continue assistindo com consentimento; favoritos; watchlist; alertas de programas; destaque patrocinado rotulado; mini-player avançado; customização de recomendações; aplicativos para TV.

## 16. Entrega e handoff
Primeira entrega de frontend inclui tokens documentados, páginas responsivas, componentes acessíveis, mocks realistas de Viamão claramente fictícios, contratos TypeScript, testes básicos, estados de loading/empty/error e instruções de `npm run dev`. Em seguida conectar Supabase e sinal de vídeo real, sem refazer a UI.
