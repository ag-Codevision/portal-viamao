# Mídia real gratuita — fontes e limites

Atualização solicitada em 12/10/2026. Sem API paga, chave, conta, proxy de vídeo, armazenamento de filmes ou serviço de retransmissão. A disponibilidade e os termos das origens podem mudar; não há garantia de operação 24/7.

## Fontes e permissões

| Conteúdo | Origem / titular | Evidência / Licença |
| --- | --- | --- |
| O Imigrante (1917) | Charles Chaplin | Domínio Público (EUA pré-1929 / Internet Archive) |
| Viagem à Lua (1902) | Georges Méliès | Domínio Público / Internet Archive |
| A General (1926) | Buster Keaton | Domínio Público / Internet Archive |
| Nosferatu (1922) | F. W. Murnau | Domínio Público / Internet Archive |
| Jejum de Amor (1940) | Howard Hawks / Columbia Pictures | Domínio Público (Direitos não renovados / Internet Archive) |
| A Dama que Desaparece (1896) | Georges Méliès | Domínio Público / Wikimedia Commons & Internet Archive |
| TV Câmara | Câmara dos Deputados | Incorporação publicada: https://www2.camara.leg.br/camaranoticias/tv/aoVivo.html; condições: https://www2.camara.leg.br/camaranoticias/tv/institucional.html |

O acervo de cinema é composto estritamente por obras históricas em domínio público e licenças livres, sem dependência de serviços pagos ou APIs com cobrança.

## API e arquitetura

`OpenVideoRepository` consulta o catálogo configurado em `open-video-sources.ts` e integrações auxiliares com a API aberta do Internet Archive (`https://archive.org/advancedsearch.php` e metadados) e Wikimedia Commons (`https://commons.wikimedia.org/w/api.php`). Validação Zod garante tipagem segura.

Cache de uma hora e timeout de oito segundos; falhas retornam indisponibilidade e link para a origem. Miniaturas reais vêm da API. O arquivo 360p é usado inicialmente para reduzir tráfego, com fallback 480p se disponível. São arquivos completos, não trailers nem recortes. Reprodução com `<video controls playsInline preload="none">`, sem autoplay. Legendas não foram disponibilizadas pela API para os três arquivos selecionados; a interface informa essa limitação e oferece a página oficial.

HLS.js é a única dependência adicional de reprodução, gratuita, importada dinamicamente após abrir o player. A arquitetura de dados/mocks e o futuro Supabase permanecem separados. A consulta de metadados ocorre no servidor; os bytes de vídeo seguem diretamente da origem ao navegador, sem passar por Next.js.

## Privacidade e experiência

O player só é montado ao clicar em “Carregar player”; a reprodução depende de uma ação posterior no controle de vídeo. O portal não inicia áudio automaticamente e não utiliza P2P. “Fechar player” remove o vídeo e encerra o decoder. Erros fatais mostram ação de tentar novamente e link oficial, sem trocar a origem silenciosamente.

O sinal pode conter legendas embutidas, conforme disponibilizado pela emissora. Os controles e recursos de acessibilidade devem ser revisados com conteúdo real; a ausência de legendas nos filmes impede afirmar acessibilidade completa do conteúdo audiovisual.

TV local e grade de Viamão seguem demonstrativas, independentes do canal público. Programas fictícios não receberam filmes de terceiros como se fossem produções locais. Filmes reais estão em uma coleção própria na home e catálogo.

## Executar e verificar

`npm run dev` ou `npm run build` + `npm run start`; porta padrão 3003. Testes: `npm test`, `npm run lint`, `npm run typecheck`, `npm run test:e2e` (Chrome instalado: definir `PLAYWRIGHT_CHANNEL=chrome`). Smoke opcional contra origens reais: `node scripts/check-media.mjs`, com áudio silenciado. Esse smoke depende da rede e não integra a suíte determinística.

Evidência complementar de licença de Elephants Dream já lançado: https://orange.blender.org/press/ (publicação oficial de lançamento, 18/05/2006, CC BY 2.5).

