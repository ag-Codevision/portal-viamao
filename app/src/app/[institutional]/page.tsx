import { notFound } from "next/navigation";
const pages: Record<string, { title: string; paragraphs: string[] }> = {
  sobre: {
    title: "Uma cidade, muitos olhares.",
    paragraphs: [
      "Viamão • Portal é o nome provisório de um projeto de TV e serviços comunitários para Viamão, RS.",
      "Esta versão é um protótipo de frontend. As produções locais, empresas, vagas e textos são fictícios. A coleção de filmes de licença aberta e o sinal oficial da TV Câmara apresentam conteúdos reais de terceiros, identificados com suas fontes. As ilustrações locais não são registros fotográficos da cidade.",
    ],
  },
  contato: {
    title: "Vamos construir essa conversa.",
    paragraphs: [
      "O canal de contato público ainda não foi definido. Nesta demonstração não coletamos mensagens nem exibimos endereços fictícios como contatos reais.",
      "Contato editorial, correções e atendimento serão informados antes do piloto público.",
    ],
  },
  privacidade: {
    title: "Sua privacidade importa.",
    paragraphs: [
      "O portal não possui autenticação, analytics próprios ou envio de formulários. Os campos de vaga são validados apenas no navegador. Metadados e miniaturas de filmes são consultados na origem oficial da Blender.",
      "Filmes externos são carregados ao clicar em Carregar player; na aba Ao Vivo, escolher um canal carrega o player. A partir desse momento, o provedor de vídeo recebe conexões do seu navegador, incluindo endereço IP, e aplica suas próprias políticas de privacidade. Fechar o player encerra sua incorporação. HLS autorizado e YouTube tentam iniciar sem som após selecionar um canal.",
      "O catálogo mundial é armazenado localmente a partir dos endpoints públicos TV Garden e IPTV-org. Ao selecionar um canal, o player do TV Garden, YouTube ou a origem HLS recebe conexões do navegador. Os provedores podem usar cookies e publicidade conforme suas políticas; o YouTube usa o domínio de incorporação youtube-nocookie.com. Esses recursos são do provedor, não analytics ou monetização ativados pelo portal. Ao abrir a aba sem canal selecionado, nenhum player é carregado.",
      "Não informe dados reais no formulário demonstrativo. A política definitiva, bases legais e prazos de retenção serão revisados antes da integração com Supabase e do lançamento.",
    ],
  },
  termos: {
    title: "Transparência desde o início.",
    paragraphs: [
      "As produções locais e vagas são demonstrativas. Filmes da Blender têm licença Creative Commons e créditos próprios. A TV Câmara é incorporada a partir do sinal oficial da emissora; a TV local de Viamão continua sem sinal real. Nenhum recurso é cobrado.",
      "Gratuito não significa sem direitos autorais. As licenças dos filmes e condições da emissora estão vinculadas junto aos players. Não são oferecidos downloads, cortes ou redistribuição do sinal. Disponibilidade e legendas dependem dos provedores. Os termos definitivos e a hospedagem serão avaliados antes do piloto público.",
      "O catálogo de canais é uma coleção de referências, não uma licença universal de reprodução. TV Garden oferece incorporação de sua interface; YouTube permite seu player incorporável, sujeito às restrições de cada vídeo. HLS direto precisa de evidência registrada no portal. Entradas sem incorporação disponível exibem aviso na mesma tela. Geobloqueios, indisponibilidade e ausência de dados locais são respeitados, sem contornar controles de acesso.",
    ],
  },
  acessibilidade: {
    title: "Um portal para todas as pessoas.",
    paragraphs: [
      "A navegação oferece link para pular ao conteúdo, foco visível, formulários rotulados, menu por teclado e respeito à preferência de movimento reduzido.",
      "Não há autoplay de áudio. Legendas e transcrições deverão acompanhar a seleção dos vídeos reais quando disponíveis. Acessibilidade continuará sendo revisada no piloto.",
    ],
  },
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ institutional: string }>;
}) {
  return {
    title:
      pages[(await params).institutional]?.title ?? "Página não encontrada",
  };
}
export default async function Institutional({
  params,
}: {
  params: Promise<{ institutional: string }>;
}) {
  const slug = (await params).institutional;
  const p = pages[slug];
  if (!p) notFound();
  return (
    <article className="container page-content reading">
      <p className="eyebrow">VIAMÃO • PORTAL · EM CONSTRUÇÃO</p>
      <h1>{p.title}</h1>
      {p.paragraphs.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </article>
  );
}
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(pages).map((institutional) => ({ institutional }));
}
