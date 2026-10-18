# Instruções para Codex — Portal TV Viamão

## Leia antes de codificar
1. `docs/spec/SPEC.md` para requisitos/escopo.
2. `docs/design/DESIGN.md` para identidade visual, tokens, responsividade e acessibilidade.
3. `docs/contexto/DECISOES.md` para decisões aprovadas.
4. `PLANO.md` para marcos de execução.

## Mandatos
- Idioma da interface e conteúdo demonstrativo: português brasileiro.
- Projeto-piloto: Viamão/RS; preparar dados para multicidade futura sem expor outras cidades no MVP.
- Stack pretendida: Next.js App Router, TypeScript, Tailwind e shadcn/ui; motion discreto.
- Backend futuro: Supabase PostgreSQL/Auth/Storage. **Não integrar SQLite ou Turso.**
- Priorizar custo de infraestrutura R$ 0 dentro dos limites e termos dos serviços.
- Não ativar produtos pagos, billing, domínio pago, serviços de terceiros pagos ou deploy real sem aprovação.
- Fase inicial: frontend com **mocks tipados**. Separar componentes, repositórios/adapters e tipos para futura integração de dados.
- TV ao vivo no frontend inicial deve ser identificada como DEMONSTRAÇÃO; não simular uma transmissão sincronizada como se fosse real.
- Vídeos e retransmissões somente quando houver direitos e permissões apropriados; YouTube público não equivale a sinal liberado para retransmissão.
- Interface própria, inspirada em boas práticas de streaming, sem copiar Netflix, artwork, marca ou código proprietário.
- Empregos sempre em seção independente; no MVP candidaturas preferencialmente externas, sem currículos armazenados.
- Sem autoplay de áudio. Observar acessibilidade e `prefers-reduced-motion`.
- Vercel Hobby: checar termos antes de lançar uso comercial/promocional. Não assumir gratuidade irrestrita para TV 24/7.
- Nunca inserir segredos Supabase no client nem versionar `.env.local`.

## Processo
- Implementar em entregas pequenas, revisáveis. Primeiro gerar estrutura e componentes com dados mockados.
- Sempre apresentar o que foi implementado, o que está pendente e como executar/testar.
- Evitar scope creep, implementação prematura de IA, pagamentos, apps nativos, streaming próprio ou infraestrutura 24/7.
- Antes de alterar arquitetura ou dependências significativamente, justificar e pedir confirmação.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
