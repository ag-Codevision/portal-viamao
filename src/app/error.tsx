"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container page-content empty-state" role="alert">
      <h1>Não foi possível carregar.</h1>
      <p>Tente novamente para continuar explorando o portal.</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
