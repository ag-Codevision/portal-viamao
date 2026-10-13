export default function Loading() {
  return (
    <div
      className="container page-content"
      role="status"
      aria-label="Carregando conteúdo"
    >
      <p className="eyebrow">Carregando o portal…</p>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-player" />
    </div>
  );
}
