# Viamão • Portal — frontend demonstrativo

Atualização: filmes reais de licença aberta (Blender) e sinal externo oficial da TV Câmara foram adicionados a pedido do usuário. As produções locais e vagas continuam mockadas. Consulte `docs/MIDIA.md` para fontes, direitos, API gratuita e comportamento dos players. Essa atualização substitui as referências abaixo a uma versão sem rede ou sem vídeo externo.

Etapa 1 da SPEC V1.1. Next.js App Router, React, TypeScript e Tailwind, com componentes UI no padrão shadcn (configuração em `components.json`, variantes com CVA e utilitário `cn`). Sem backend, autenticação, cobrança ou deploy.

## Executar localmente

Requer Node.js >= 20.9 (validado com 22.22.3).

```powershell
cd 'F:\_Meus Projetos 2025\HUB TV\app'
npm ci
npm run dev
```

Abra http://localhost:3003. Para testar a versão de produção: `npm run build` e `npm run start`.

## Verificar

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright testa desktop e viewport móvel, rotas públicas, busca/empty, validação de formulário, menu e 404. Axe verifica acessibilidade nas páginas. O teste inicia `next start`; faça o build antes. Não execute dois builds simultâneos.

## Arquitetura

- `src/app/`: páginas e estados loading/error/404; SSR para conteúdo e busca.
- `src/components/`: layout, UI, mídia, player demonstrativo e empregos.
- `src/types/`: entidades e contratos tipados de estados.
- `src/lib/data/contracts.ts`: interface `PortalRepository`.
- `src/lib/data/mock-repository.ts`: implementação demonstrativa.
- `src/lib/data/index.ts`: composição e funções usadas pelas páginas.
- `src/mocks/`: dados fictícios de Viamão, sem cidades adicionais visíveis.
- `src/lib/validation/`: validação de formulário com Zod.
- `public/art/`: ilustrações SVG originais produzidas para o protótipo. Não são fotografias de Viamão.

Na Etapa 2, criar adapter Supabase no servidor que implemente `PortalRepository` e substituí-lo no ponto de composição. Adicionar `server-only`, tipos gerados, validação server-side, Auth/RLS e migrações então. Nenhuma chave, SDK ou banco está integrado nesta versão. Não usar SQLite/Turso. O contrato futuro de reprodução deve incluir direitos verificados, sem confiar apenas no provider.

## Design e demonstração

Tokens do DESIGN.md estão centralizados em `src/app/globals.css` e expostos ao tema Tailwind. Grafite, dourado editorial, cards 16:9 e hero estática. Fonte local do sistema como fallback nesta entrega; não há download de fonte externa. Reduced motion desativa animações e rolagem suave.

Grade e validade das vagas usam a referência **12/10/2026 às 18:20**, em `America/Sao_Paulo`, para que o protótipo permaneça reproduzível. O adapter Supabase deverá usar horário real do servidor, expiração real e origem de sinal autorizada. Não há sinal, vídeo, badge de live ativo ou progresso de transmissão simulado.

Formulário valida em memória e confirma explicitamente que nada foi enviado ou armazenado. Candidaturas estão indisponíveis para vagas fictícias. Não há analytics, cookies de rastreamento, persistência de favoritos ou upload de currículos. Robots e metadata bloqueiam indexação do protótipo; definir domínio, canônicas e sitemap somente quando houver endereço aprovado.

## Próximas etapas

Supabase/CMS e moderação, vídeo autorizado, conteúdo real, contatos e políticas definitivas. Fotografias autorais, fonte definitiva e auditoria de performance em aparelho/rede móvel reais ficam para refinamento e piloto. Deploy depende de aprovação e avaliação dos termos de hospedagem. Nenhum produto pago foi ativado.

A porta padrão de desenvolvimento e produção local é 3003. Para usar o Chrome já instalado no QA: $env:PLAYWRIGHT_CHANNEL='chrome'; npm run test:e2e. Slugs de detalhes são gerados no build nesta fase de mocks; rever cache/revalidação e dynamicParams quando o CMS permitir novos conteúdos.



## Catálogo mundial
A rota /ao-vivo agora inclui catálogo offline TV Garden + IPTV-org, lista ao lado do player e filtros por país/estado/cidade. Atualize manualmente com npm run tv:sync e reinicie o processo. Fontes, limites de reprodução e testes: docs/TV-MUNDIAL.md. O JSON local está em data/tvgarden-tv.json e não é enviado inteiro ao navegador.

