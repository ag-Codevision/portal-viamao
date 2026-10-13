import { ButtonLink } from "./button";
export function EmptyState({
  title = "Nenhum resultado por aqui",
  description = "Experimente outra busca ou remova os filtros.",
  href = "/programas",
  action = "Limpar filtros",
}: {
  title?: string;
  description?: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="empty-state" role="status">
      <span aria-hidden="true">◇</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <ButtonLink variant="secondary" href={href}>
        {action}
      </ButtonLink>
    </div>
  );
}
export function SectionHeading({
  title,
  kicker,
  href,
  label = "Explorar tudo",
}: {
  title: string;
  kicker?: string;
  href?: string;
  label?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {kicker && <p className="eyebrow">{kicker}</p>}
        <h2>{title}</h2>
      </div>
      {href && (
        <a className="text-link" href={href}>
          {label} <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}
