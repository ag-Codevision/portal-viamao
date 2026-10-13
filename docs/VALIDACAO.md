# Validação da Etapa 1

Referência do projeto: 12/10/2026. Ambiente local Windows, Node 22.22.3, Next 16.4.0. Nenhum deploy ou serviço pago foi ativado.

- `npm run lint`: passou sem erros ou warnings.
- `npm run typecheck`: passou; o build também verificou TypeScript.
- `npm test`: 4 testes passaram (território, slugs, filtros, grade/fuso e validação).
- `npm run build`: passou, 37 páginas geradas contando rotas internas e variações.
- Playwright com Chrome instalado: 7 cenários aplicáveis passaram entre desktop e mobile; 1 ignorado por ser menu móvel em desktop. Após ajustes de seletores, o fluxo busca/formulário foi repetido isoladamente e passou nos dois viewports. Demais cenários passaram na rodada do mesmo build final.
- Axe: 16 rotas por viewport, nenhum problema nas regras WCAG 2 A/AA, 2.1 AA e 2.2 AA avaliadas. Isso não certifica conformidade completa.
- Sem overflow em 1440px e viewport iPhone 13. Home também inspecionada em capturas desktop e 390px.
- `npm audit --omit=dev`: zero vulnerabilidades. Auditoria completa indicou 5 alertas altos propagados por `braces`/`micromatch`/`fast-glob` no linter. A versão publicada de braces era 3.0.3 e não havia correção compatível; não foi aplicado downgrade forçado de Next/eslint-config-next. Revisitar quando houver atualização.

A auditoria heurística da skill frontend-design gerou falsos positivos sobre campos sem label em cards que não têm campos, e recomendações genéricas. Foi complementada por revisão de código, Axe e testes reais de teclado/menu/formulário. Foram corrigidos foco no primeiro erro, contraste/estados nativos de dark mode, alvos dos controles de trilho e legibilidade de metadados.

Pendências para piloto: métricas de performance em dispositivo/rede reais, revisão humana mais ampla de acessibilidade, conteúdo/licenças reais, fotos autorais, identidade/fonte definitiva, contatos e políticas aprovadas, Supabase/CMS e player autorizado. Etapas 2–4 permanecem abertas no PLANO.md.

## Atualização: vídeos reais e canal público

API pública da Blender integrada com três filmes curados e licença verificada na fonte. Reprodução MP4 direta via navegador, sem proxy, armazenamento ou autoplay. TV Câmara usa o sinal oficial publicado no player para incorporação, com HLS.js carregado sob demanda no Chrome e suporte nativo quando disponível.

- 8 testes de dados/validação passaram, incluindo isolamento de API, metadados privados, rejeição de URLs externas e indisponibilidade.
- Build e TypeScript passaram; lint sem warnings; `npm audit --omit=dev` continuou com zero vulnerabilidades.
- Rodada de UI dos players: 9 testes passaram e 1 foi ignorado por ser específico do menu móvel. Axe verificou 19 rotas nos dois viewports sem violações nas regras avaliadas antes de carregar mídia.
- Reprodução real confirmada no Chrome pelo smoke: Big Buck Bunny, Sintel, Elephants Dream e TV Câmara tiveram avanço de `currentTime`, estado de vídeo decodificado e reprodução ativa. O teste usou áudio silenciado.
- Os players antigos de iframe não iniciaram a reprodução nos primeiros testes. A implementação final usa arquivos MP4 oficiais e compatibilidade HLS, e foi validada com vídeo efetivamente avançando.
- Legendas dos três arquivos de filme não foram fornecidas pela API. A UI informa essa limitação; não há afirmação de acessibilidade completa do conteúdo audiovisual.

Porta local 3003. Direitos/fontes e limites: `MIDIA.md`. Supabase e TV local real continuam pendentes. Nenhum produto pago ou deploy foi ativado.

Ajuste final do catálogo: quatro testes de busca passaram (fluxo existente e filmes reais, em desktop e mobile). Filtros incluem Cinema de licença aberta. O build e TypeScript do ajuste passaram; lint dos arquivos alterados passou.


## Catálogo mundial TV Garden / IPTV-org

Snapshot final: 9.960 registros, 183 países/territórios, 251 registros brasileiros. TV Garden: 6.854 registros aproveitados; IPTV-org adicional: 3.106. Importação sem países com erro. Estado/cidade presentes para 1.095 registros, conforme cobertura informada pelos feeds, sem inferir capital/sede.

- 14 testes unitários/dados passaram, incluindo gzip, bloqueios, união de fontes, geografia, URLs inseguras, filtros, payload/paginação e política de fontes diretas.
- TypeScript e build passaram. Lint completo passou; lint dos últimos componentes alterados também passou.
- Rodada de UI: 17 cenários passaram e 1 foi ignorado; 2 falharam pelo nome acessível do seletor de país, que incluía as opções. Rótulos foram corrigidos na implementação.
- Depois da correção, 6 cenários afetados passaram em desktop e mobile: navegação/filtros/seleção/URL, iframe só por gesto, sandbox/sem autoplay, acessibilidade e ausência de overflow. Os demais cenários passaram na rodada anterior e não foram alterados.
- Provedor real: o iframe de TVE RS abriu `https://tvgarden.world/tv/br/eTCuy4QKHtum76`, e o conteúdo da plataforma reconheceu o canal selecionado. Isso confirma o link profundo e a incorporação; não certifica disponibilidade permanente de todos os sinais.
- Capturas desktop (1440px) e mobile (390px) revisadas. Canais ao lado do player no desktop, abaixo no mobile, com lista rolável e paginação.

A reprodução mundial usa a incorporação oferecida pelo TV Garden para seus registros. HLS direto continua restrito à curadoria autorizada, e entradas adicionais sem incorporação usam a página informada da emissora. Não foi feita licença universal dos vídeos nem prometida reprodução de todos os registros. O TV Garden pode exibir anúncios/cookies próprios após carregamento; isso foi informado na UI e privacidade.

Sem serviços pagos, billing, SQLite/Turso, Supabase ou deploy. Atualização manual: `npm run tv:sync`, reiniciar o processo local. Limites e arquitetura: `TV-MUNDIAL.md`.

## Troca de canal — 13/10/2026

Entrada sem canal inicial; seleção por clique monta o player dentro da página. YouTube usa a incorporação da plataforma, HLS direto preserva a curadoria. Ambos tentam iniciar sem áudio após seleção. TV Garden pode exigir Play interno; não há comando de reprodução documentado. Entradas sem permissão HLS registrada nem embed disponível mostram aviso local.

Build, lint e 15 testes de dados passaram. Dez cenários E2E passaram nos dois viewports: nenhum canal destacado na entrada, filtros/URL, iframe montado pelo clique, YouTube com parâmetros de início sem som, troca desmontando iframe anterior, HLS sem som, fechamento e acessibilidade. Iframes de terceiros foram controlados nos testes. Verificação das fontes reais: três filmes Blender e TV Câmara reproduziram com avanço de tempo, sem erro; isso não certifica todos os canais do catálogo.
