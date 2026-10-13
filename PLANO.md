# Plano de implementação — MVP

## Etapa 1 — Frontend com dados simulados (iniciar aqui)
- [x] Criar projeto Next.js App Router + TypeScript + Tailwind na pasta `app/`.
- [x] Configurar tokens, layouts, tipografia, componentes UI e responsividade do DESIGN.md.
- [x] Header, navegação, home cinematográfica e footer.
- [x] Rota `/ao-vivo`: player **demo explicitamente rotulado**, agora/próximo e grade fictícia.
- [x] Catálogo `/programas`, detalhes, busca/filtros e páginas VOD com dados mockados.
- [x] Módulo `/empregos` isolado, vagas de demonstração e formulário frontend (sem envio real).
- [x] Estados vazios, loading, erros, acessibilidade, mobile e modo de movimento reduzido.
- [x] Validar build, navegação, testes básicos e documentação de execução.

## Etapa 2 — Persistência e operações editoriais
- [ ] Criar projeto Supabase Free, configurar variáveis de ambiente local e políticas RLS.
- [ ] Modelar cidades, programas, episódios, grade, notícias, empresas e vagas.
- [ ] Conectar repositórios de dados mockados às consultas reais.
- [ ] Construir autenticação e painel administrativo com autorização server-side.
- [ ] Publicação/moderação de vagas com proteção antispam e cuidado com LGPD.

## Etapa 3 — Vídeo real e validação
- [ ] Integrar vídeos próprios/embeds autorizados do YouTube.
- [ ] Definir fonte operacional de live real, programação 24/7 e direitos de retransmissão.
- [ ] Integrar estado da transmissão real, grade e telemetria viável.
- [ ] Testar disponibilidade, política de autoplay e falhas de player.

## Etapa 4 — Piloto de Viamão
- [ ] Conteúdo local inicial, QA, SEO e métricas com consentimento.
- [ ] Verificar termos do plano de hospedagem no momento do lançamento público.
- [ ] Publicar versão piloto e acompanhar uso e limites gratuitos.

## Depois do MVP
Expansão multicidade, planos de publicidade e monetização só após validação de audiência e infraestrutura.

