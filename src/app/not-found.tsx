import { EmptyState } from "@/components/ui/states";
export default function NotFound() {
  return (
    <div className="container page-content">
      <h1>Página não encontrada</h1>
      <EmptyState
        title="Esse caminho ainda não existe."
        description="Volte ao início para descobrir as histórias do portal."
        href="/"
        action="Voltar ao início"
      />
    </div>
  );
}
