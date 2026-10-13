# Catálogo mundial de TV — TV Garden + IPTV-org

Entrega solicitada em 12/10/2026. Implementada na stack Next.js existente, com snapshot JSON e consultas locais; sem SQLite, Turso, novo serviço, dependência adicional, billing ou deploy. O catálogo de canais externos é global por pedido do usuário; produções, notícias, empregos e a cidade do portal continuam restritos ao piloto de Viamão.

## Arquivos e execução

- `lib/providers/tv-garden.mjs`: endpoints públicos de metadados e canais por país. Suporta JSON e gzip com detecção pelo conteúdo (os endpoints retornam gzip sem necessariamente informar Content-Encoding).
- `lib/providers/catalog-normalizer.mjs`: combinação das fontes, filtros de URLs, IDs, YouTube e dados territoriais.
- `scripts/sync-tv-catalog.mjs`: importação manual, quatro consultas de países por vez, timeout/retry e escrita atômica.
- `data/tvgarden-tv.json`: snapshot versionável, consumido apenas no servidor.
- `src/lib/data/world-tv-repository.ts`, `world-tv-query.ts`, `world-tv-policy.ts`: leitura do snapshot, filtros/paginação e decisão do player.
- `GET /api/tv/catalog`: API local, 25 registros por página; valida filtros e omite URLs de streams não verificados.
- `src/components/live/world-tv-browser.tsx`: player + lista lateral; responsividade, pesquisa, filtros, paginação, estados e seleção persistida na URL.

```powershell
cd 'F:\_Meus Projetos 2025\HUB TV\app'
npm run tv:sync
npm run build
npm run start
```

Abra http://localhost:3003/ao-vivo. Para desenvolvimento: `npm run dev`. Depois de trocar o snapshot, reinicie o processo; a leitura é mantida em memória. Não é necessário importar durante `dev`, `build` ou cada visita: o snapshot já está incluído no projeto. O Next inclui o JSON no tracing das rotas para futura hospedagem.

## Contagens reais

O snapshot final desta entrega tem **9.960 registros**, **183 países/territórios** e **251 registros brasileiros**, combinando as fontes. Destes, 6.854 possuem identificador TV Garden e 3.106 são entradas adicionais do IPTV-org. O metadata do TV Garden anuncia 172 países com canais e 6.901 entradas antes dos filtros/normalização. Essas contagens variam e são calculadas na importação; não se fixam os números 6.768/172/150 do pedido.

Registros não são garantia de emissoras únicas nem de disponibilidade de cada sinal. Foram removidos links incompatíveis, conteúdos bloqueados identificados na blocklist, canais encerrados/substituídos e conteúdo adulto identificado nos metadados. O snapshot registra erros de país: se uma coleta falhar, recupera a versão anterior quando possível e sinaliza importação parcial. Se a coleta principal falhar, não sobrescreve o arquivo anterior.

## Geografia e performance

País vem do catálogo. `UK` é normalizado para `GB` na interface e permanece `uk` no link TV Garden. Nomes de países são apresentados em português pelo Intl. Estado/região e cidade vêm das áreas de cobertura dos feeds IPTV-org, cruzadas com subdivisions/cities — não da capital, de suposições pelo nome ou de uma localização inventada. Cobertura não é necessariamente a sede da emissora. “Não informado” permite consultar os canais sem informação local. Apenas 1.095 registros têm informação territorial aproveitável neste snapshot.

Os filtros e a busca rodam no servidor sobre o snapshot, com payload limitado a 25 registros. O navegador não recebe os 6,5 MB do catálogo completo. Busca não depende de APIs externas, e mudar filtros não interrompe o canal selecionado. Só trocar o canal desmonta o player anterior. Solicitações antigas são abortadas/ignoradas para impedir resultados fora de ordem.

## Fontes e reprodução

TV Garden publica endpoints públicos, mas não foi encontrada garantia de API versionada, SLA ou licença universal para os vídeos. O próprio site oferece expressamente incorporação de sua plataforma por iframe, inclusive por país: https://tvgarden.world/ (seção Embed). O formato de seleção `/tv/{country}/{nanoid}` foi confirmado no cliente publicado pela plataforma. Usa-se essa incorporação para registros TV Garden que ainda não têm curadoria individual de reprodução direta.

Não copiar a interface, código ou artwork do TV Garden para o portal. O layout do portal é próprio; o iframe mantém a interface do provedor. Ele é criado ao escolher o canal na lista, sem botão intermediário, sem permissão de autoplay, pop-ups, formulários, downloads ou navegação do documento superior no sandbox. O provedor pode exigir Play dentro do iframe; não há controle remoto documentado para iniciar esse player. Há fechamento e link opcional para a origem. O TV Garden declara analytics/publicidade; a interface e a página de privacidade avisam sobre cookies e anúncios do terceiro. Não há analytics, anúncios próprios ou integração paga ativados no portal.

Fontes diretas em HLS requerem registro em `world-tv-policy.ts`, com identidade, URL exata e evidência de permissão. A TV Câmara conserva o sinal já verificado, diretamente da emissora, com HLS.js. Não basta o canal existir num JSON nem o link usar HTTPS. Fontes YouTube normalizadas usam exclusivamente o player incorporável `youtube-nocookie.com`, autorizado como recurso da plataforma nos termos https://www.youtube.com/static?template=terms. Bloqueios de incorporação, remoções e indisponibilidade são respeitados; essa permissão não licencia download ou retransmissão independente. Não há API key, cobrança, download, corte, proxy, playout ou retransmissão pelo servidor.

Entradas apenas IPTV-org sem fonte YouTube incorporável nem autorização HLS registrada mostram indisponibilidade na própria tela. A seleção não abre nova aba. Não se promete que todos os 9.960 registros possam reproduzir no player do portal.

A entrada na aba começa sem canal selecionado; não há destaque automático da TV Câmara. Um clique seleciona e monta o player, desmontando o anterior. HLS autorizado e YouTube tentam iniciar sem som após essa ação; o usuário ativa áudio no controle do vídeo. A URL preserva o canal, mas recarregar a página não inicia reprodução automaticamente. Os filmes sob demanda mantêm seu fluxo de carregamento manual.

O IPTV-org licencia seu código/dados sob Unlicense; isso não licencia as obras audiovisuais. Sua documentação descreve links públicos submetidos por usuários e um procedimento de remoção: https://github.com/iptv-org/iptv. Documentação de metadados: https://github.com/iptv-org/api. O portal respeita blocklist e não tenta contornar geobloqueios, credenciais, DRM ou cabeçalhos especiais.

## Validação e próximos passos

Testes cobrem gzip, URLs inseguras, blocklist, normalização, filtros reais, paginação, ausência de localização inventada, política de reprodução, API inválida/erro, seleção, URL e fechamento do player. QA do iframe usa uma resposta controlada para não carregar anúncios nos testes; disponibilidade real da plataforma continua sujeita ao terceiro.

Para o piloto público: revisar canais e permissões, processo de retirada, precisão dos metadados, consentimento/políticas e termos de hospedagem. Para permitir HLS direto de outros canais, registrar prova verificável por origem. O Supabase futuro pode armazenar snapshot/curadoria sem alterar a interface. A TV local de Viamão e sua grade continuam DEMONSTRAÇÃO.
