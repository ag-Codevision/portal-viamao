# Integração futura

Atualização de mídia: a interface `OpenVideoRepository` consulta a API pública da Blender separadamente dos mocks locais; o sinal da TV Câmara é reproduzido diretamente da origem oficial com compatibilidade HLS no navegador. A descrição abaixo sobre ausência de rede se refere à implementação inicial e aos mocks locais. Ver `MIDIA.md`.

As páginas consomem somente `src/lib/data/index.ts`. O contrato `PortalRepository` separa a UI da implementação de acesso a dados. Na Etapa 1, `mockRepository` usa arrays tipados, sem SDK, rede, persistência ou variáveis de ambiente.

`cityId` acompanha as entidades locais; o piloto usa apenas `viamao`. Status editorial restringe as listagens. Busca e filtros estão na URL, permitindo links diretos, navegação nativa e execução no servidor.

Ao conectar Supabase:

1. Criar adapter em módulo exclusivo do servidor (`server-only`) e mapear `snake_case` PostgreSQL para as entidades públicas.
2. Implementar o mesmo contrato, usando `city_id`, status publicado e expiração real. Os mocks usam uma referência temporal fixa e não devem controlar dados reais.
3. Trocar a instância no módulo de composição; usar horário do servidor e fuso da cidade.
4. Rever as páginas pré-geradas e `dynamicParams = false`: na demonstração há uma lista fixa de slugs; o CMS exigirá estratégias de revalidação e novos slugs publicados.
5. Integrar Auth/RLS, migrações versionadas e validação server-side dos formulários, com moderação e antispam. A validação Zod local não constitui proteção de backend.
6. Definir contrato público de disponibilidade e direitos de reprodução antes de conectar player autorizado. Não transferir credenciais operacionais ou provas privadas de licenças ao client.

Políticas e contato atuais explicam a demonstração; não substituem as versões aprovadas para o piloto público. Sem deploy nesta etapa.


Catálogo mundial: módulo separado com snapshot JSON, importadores públicos e API local paginada. Interface de dados em src/types/world-tv.ts; política de fontes diretas separada em world-tv-policy.ts. A integração não usa Supabase, não altera os mocks do piloto nem cria cidades locais adicionais. Ver TV-MUNDIAL.md.

