# Portal TV Viamão — Workspace para Codex

Projeto-piloto de plataforma local de TV ao vivo, catálogo de vídeos sob demanda, notícias e vagas de emprego, começando por **Viamão/RS**.

## Como começar no Codex

1. Extraia este ZIP e abra a pasta `portal-tv-viamao` como projeto no Codex (ou num editor conectado ao Codex).
2. Leia `AGENTS.md` e os documentos `docs/spec/SPEC.md` e `docs/design/DESIGN.md`.
3. Peça ao Codex: **"Leia AGENTS.md, a SPEC e o DESIGN.md. Execute somente a Etapa 1 do PLANO.md: inicialize o frontend Next.js responsivo com mocks e sem integrações pagas."**
4. Valide primeiro as telas com dados fictícios antes de conectar Supabase e live real.

## Documentação

- `AGENTS.md` — instruções operacionais permanentes para agentes.
- `PLANO.md` — sequência de desenvolvimento incremental.
- `docs/spec/SPEC.md` — requisitos funcionais e técnicos V1.1 (fonte da verdade).
- `docs/spec/SPEC_v1.1.docx` — versão editável Word.
- `docs/design/DESIGN.md` — sistema visual e UX (fonte da verdade de design).
- `docs/contexto/DECISOES.md` — decisões registradas durante a conversa.
- `docs/historico/SPEC_v1.0.docx` — versão anterior como referência histórica, **não usar para sobrescrever a V1.1**.
- `app/` — frontend Next.js com mocks tipados; consulte [instruções da aplicação](app/README.md).

## Escopo do ZIP

A Etapa 1 contém home responsiva, TV demonstrativa, catálogo, episódios, notícias e empregos separados. Execute `npm ci` e `npm run dev` em `app/` e abra http://localhost:3003. Nenhuma credencial, backend ou integração paga está incluída. Conteúdos são fictícios.
