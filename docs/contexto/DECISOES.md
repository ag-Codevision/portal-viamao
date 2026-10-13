# Decisões tomadas na conversa

**Produto:** portal digital de TV e serviços locais; nome comercial ainda não definido.

**Cidade-piloto:** Viamão, Rio Grande do Sul. A expansão é regional no futuro; não criar múltiplas instâncias do site.

**Experiência TV:** streaming moderno com estética premium; dois modos reais quando integrado: TV linear ao vivo (continuidade do sinal, não reiniciar na entrada) e biblioteca de vídeos sob demanda. Grade inclui jornalismo, documentários, programas autorais, vídeos promocionais e eventualmente canais de terceiros **somente com autorização de retransmissão**.

**Outros serviços:** vagas de emprego em aba separada; arquitetura extensível para serviços futuros.

**Modelo inicial:** toda publicação gratuita para construir audiência; monetização e venda de publicidade são fases posteriores.

**Ordem de implementação:** primeiro frontend completo e navegável com dados demonstrativos, depois backend, Supabase e integração da TV real.

**Stack aprovada:** Next.js/React/TypeScript/Tailwind; Supabase (PostgreSQL, Auth, Storage) como substituto do SQLite inicialmente cogitado. Vercel como preferência de hospedagem para desenvolvimento.

**Restrição prioritária:** custo de infraestrutura R$ 0 no início, conforme limites e termos dos planos gratuitos. Não confundir preferência por custo zero com garantia de TV 24/7 grátis ou permissão comercial do Vercel Hobby.

**Princípio de design:** experiência original de streaming, cinematográfica, responsiva; área de empregos separada e prática.

**Pendências:** nome/marca definitivos, conteúdos/licenças, origem da transmissão contínua, cronograma editorial, parâmetros finais de hospedagem pública.

**Atualização autorizada em 12/10/2026:** adicionar vídeos gratuitos com permissões verificadas e TV pública externa. Implementação: coleção de filmes Blender sob CC BY, consulta à API oficial sem chave e visualização do sinal oficial da TV Câmara, com decoder HLS gratuito no navegador. A TV local de Viamão e a sua grade permanecem demonstrativas, sem infraestrutura de retransmissão. Licença aberta não equivale a ausência de copyright. Fontes e limites registrados em `app/docs/MIDIA.md`.


**Expansão autorizada pelo usuário em 12/10/2026:** catálogo internacional de canais externos com TV Garden/IPTV-org, lista lateral e filtros territoriais. Esta é uma ampliação da descoberta de TV; a cidade do portal, empregos e produções locais permanecem Viamão. Snapshot offline e API local paginada, sem nova infraestrutura paga ou alteração da stack. Usar incorporação expressamente oferecida pelo TV Garden; fontes diretas exigem curadoria/evidência. Contagens e limitações em app/docs/TV-MUNDIAL.md.

**Ajuste solicitado na conversa em 13/10/2026:** aba Ao Vivo sem canal padrão nem destaque da TV Câmara; escolher na lista carrega o player dentro da página. HLS autorizado e YouTube incorporado tentam iniciar sem áudio após o clique. Usar o player YouTube oferecido nos termos da plataforma, respeitando bloqueios de incorporação; não equivale a licença de retransmissão independente. TV Garden permanece iframe autorizado, sujeito ao Play interno do provedor. Canais sem incorporação disponível mostram estado local, sem encaminhamento obrigatório para nova aba. Arquitetura e dependências preservadas.

